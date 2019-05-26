import { Component, OnInit } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../events.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  event: Event;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute, 
    private eventsService: EventsService, 
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/my-events');
        return;
      }
      this.event = this.eventsService.getEvent(paramMap.get('eventId'));
      this.form = new FormGroup({name: new FormControl(this.event.name, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      desc: new FormControl (this.event.desc, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.maxLength(255)]
        })

      });
    });
  }

  onUpdateEvent() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
  }

}
