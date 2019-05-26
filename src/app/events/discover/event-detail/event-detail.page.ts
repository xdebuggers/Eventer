import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  NavController,
  ModalController,
  ActionSheetController
} from '@ionic/angular';
import { EventsService } from "../../events.service";
import { Event } from "../../event.model";
import { JoinEventComponent } from "./../../../joined-events/join-event/join-event.component";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-event-detail",
  templateUrl: "./event-detail.page.html",
  styleUrls: ["./event-detail.page.scss"]
})
export class EventDetailPage implements OnInit, OnDestroy {
  event: Event;
  private eventSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalCtrl: ModalController,
    private actionsheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/discover');
        return;
      }
      this.eventSub = this.eventsService.getEvent(paramMap.get('eventId')).subscribe(event => {
        this.event = event;
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
          console.log('Joined');
        }
      });
  }
}
