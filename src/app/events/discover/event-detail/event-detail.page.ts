import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
  AlertController
} from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Event } from '../../event.model';
import { JoinEventComponent } from './../../../joined-events/join-event/join-event.component';
import { Subscription } from 'rxjs';
import { JoinedEventsService } from './../../../joined-events/joined-events.service';
import { LoginService } from './../../../login/login.service';
import { MapModalComponent } from '../../../shared/map-modal/map-modal.component';

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.page.html",
  styleUrls: ["./event-detail.page.scss"]
})
export class EventDetailPage implements OnInit, OnDestroy {
  event: Event;
  isJoinable = false;
  isLoading = false;
  private eventSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalCtrl: ModalController,
    private actionsheetCtrl: ActionSheetController,
    private joinedEventsService: JoinedEventsService,
    private loadingCtrl: LoadingController,
    private loginService: LoginService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.eventSub = this.eventsService.getEvent(paramMap.get('eventId')).subscribe(event => {
        this.event = event;
        this.isJoinable = event.userId !== this.loginService.userId;
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({header: 'Ooops', message: 'Could not load the event', buttons: [{text: 'OK', handler: () => {
          this.router.navigate(['/events/tabs/discover']);
        }}]}).then(alertEl => {
          alertEl.present();
        });

      });
    });
  }
  ngOnDestroy() {
    if(this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }

  onJoinEvent() {
    this.actionsheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Going',
            handler: () => {
              this.openJoinEventModal('going');
            }
          },
          {
            text: 'Interested',
            handler: () => {
              this.openJoinEventModal('interested');
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }
  openJoinEventModal(mode: 'going' | 'interested') {
    console.log(mode);
    this.modalCtrl
      .create({
        component: JoinEventComponent,
        componentProps: { selectedEvent: this.event, selectedMode: mode }
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(resaultData => {
        console.log(resaultData.data, resaultData.role);
        if (resaultData.role === 'confirm') {
          this.loadingCtrl.create({
            message: 'Joining Event...'
          }).then(loadingEl => {
            loadingEl.present();
            const data = resaultData.data.joinData;
            this.joinedEventsService.joinEvent(
            this.event.id,
            this.event.name,
            this.event.imgUrl,
            data.firstName,
            data.lastName,
            data.comment,
            data.type
            ).subscribe(() => {
              loadingEl.dismiss();
            });

          });
        }
      });
  }
  onShowFullMap() {
    this.modalCtrl.create({component: MapModalComponent, componentProps: {
      center: {lat: this.event.location.lat, lng: this.event.location.lng},
      selectable: false,
      closeBtnText: 'Close',
      title: this.event.location.address
    }}).then(modalEl => {
      modalEl.present();
    });
  }
}
