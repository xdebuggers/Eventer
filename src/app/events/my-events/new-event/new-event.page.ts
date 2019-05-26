import { Component, OnInit } from '@angular/core';
import { EventsService } from './../../events.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  form: FormGroup;
  constructor() { }

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
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
  }


}
