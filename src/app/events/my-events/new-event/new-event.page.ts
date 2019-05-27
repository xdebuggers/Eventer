import { Component, OnInit } from '@angular/core';
import { EventsService } from './../../events.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { EventLocation } from '../../location.model';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  form: FormGroup;
  constructor(
    private eventsService: EventsService,
    private router: Router,
    private loadingCtrl: LoadingController
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
        } ),
        location: new FormControl(null, {validators: [Validators.required]})
    });
  }
  onLocationPicked(location: EventLocation) {
    this.form.patchValue({ location: location });

  }

  onCreateEvent() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating Event...'
    }).then(loadingEl => {
      loadingEl.present();

      const date = new Date (this.form.value.date);
      const time = new Date (this.form.value.time);
      const s = date.toDateString() + ' ' + time.toLocaleTimeString();
      //console.log(s);
      this.eventsService.addEvent(
      this.form.value.name,
      this.form.value.desc,
      this.form.value.capacity,
      new Date(s),
      this.form.value.location
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/events/tabs/my-events']);
      });
    });
  }


}
