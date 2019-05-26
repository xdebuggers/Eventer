import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../events.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit, OnDestroy {

  event: Event;
  form: FormGroup;
  private eventSub: Subscription;

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
      this.eventSub = this.eventsService.getEvent(paramMap.get('eventId')).subscribe(event => {
        this.event = event;
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
    });
  }
  ngOnDestroy() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }

  onUpdateEvent() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
  }

}
