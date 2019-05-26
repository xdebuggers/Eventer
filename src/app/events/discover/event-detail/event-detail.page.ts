import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Event } from '../../event.model';
import { JoinEventComponent } from './../../../joined-events/join-event/join-event.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: Event;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalCtrl: ModalController,
    private actionsheetCtrl: ActionSheetController
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
    if (!paramMap.has('eventId')) {
      this.navCtrl.navigateBack('/events/tabs/discover');
      return;
    }
    this.event = this.eventsService.getEvent(paramMap.get('eventId'));
  });
  }

  onJoinEvent() {
    this.actionsheetCtrl.create({
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
    }).then(actionSheetEl =>{
      actionSheetEl.present();
    });
  }
  openJoinEventModal(mode: 'going' | 'interested') {
      console.log(mode);
      this.modalCtrl.create({component: JoinEventComponent,
        componentProps: {selectedEvent: this.event}
        })
        .then(modalEl => {
          modalEl.present();
          return modalEl.onDidDismiss();
        })
        .then(resaultData => {
          console.log(resaultData.data, resaultData.role);
          if(resaultData.role === 'confirm') {
            console.log('Joined');
          }
        });
  }
}
