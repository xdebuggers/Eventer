import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../events.service';
import {
  NavController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss']
})
export class EditEventPage implements OnInit, OnDestroy {
  event: Event;
  eventId: string;
  form: FormGroup;
  isLoading = false;
  private eventSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private navCtrl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/my-events');
        return;
      }
      this.eventId = paramMap.get('eventId');
      this.isLoading = true;
      this.eventSub = this.eventsService
        .getEvent(paramMap.get('eventId'))
        .subscribe(
          event => {
            this.event = event;
            this.form = new FormGroup({
              name: new FormControl(this.event.name, {
                updateOn: 'blur',
                validators: [Validators.required]
              }),
              desc: new FormControl(this.event.desc, {
                updateOn: 'blur',
                validators: [Validators.required, Validators.maxLength(255)]
              })
            });
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'Ooops!',
                message: 'Event could not found, Please try again later',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {
                      this.router.navigate(['/events/tabs/my-events']);
                    }
                  }
                ]
              })
              .then(alertEl => {
                alertEl.present();
              });
          }
        );
    });
  }
  ngOnDestroy() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }

  onUpdateEvent() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl
      .create({
        message: 'Updating Event...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.eventsService
          .updateEvent(
            this.event.id,
            this.form.value.name,
            this.form.value.desc
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/events/tabs/my-events']);
          });
      });
  }
}
