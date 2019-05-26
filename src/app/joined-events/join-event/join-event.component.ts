import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/events/event.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.component.html',
  styleUrls: ['./join-event.component.scss'],
})
export class JoinEventComponent implements OnInit {

  @Input() selectedEvent: Event;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onJoinEvent() {
    this.modalCtrl.dismiss({message: 'this is a test message'}, 'confirm');
  }
}
