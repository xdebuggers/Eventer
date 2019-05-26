import { Component, OnInit } from '@angular/core';
import { EventsService } from './../../events.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  form: FormGroup;
  constructor(
    private eventsService: EventsService,
    private router: Router
    ) { }

  ngOnInit() { 
    this.form = new FormGroup({
      name: new FormControl(null,{
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      desc: new FormControl (null,{
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(255)]
        }),
      capacity: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required, Validators.min(1)]
        }),
      date: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required]
        }),
      time: new FormControl(null,{
          updateOn: 'blur',
          validators: [Validators.required]
        } )
    });
  }

  onCreateEvent() {
    if (!this.form.valid) {
      return;
    }
    let s = (this.form.value.date).toString() + ' ' + (this.form.value.time).toString();
    this.eventsService.addEvent(
      this.form.value.name,
      this.form.value.desc,
      this.form.value.capacity,
      new Date(s)
      );
    this.form.reset();
    this.router.navigate(['/events/tabs/my-events']);
  }


}
