import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Event } from 'src/app/events/event.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-join-event',
  templateUrl: './join-event.component.html',
  styleUrls: ['./join-event.component.scss'],
})
export class JoinEventComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() selectedMode: 'going' | 'interested';
  @ViewChild('f') form: NgForm;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {


  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onJoinEvent() {
    if (!this.form.valid) {
      return;
    }
    if (this.selectedMode === 'going'){
      this.modalCtrl.dismiss({joinData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        comment: this.form.value.comment,
        type: 'Going'
      } }, 'confirm');

    } else {
      this.modalCtrl.dismiss({joinData: {
        firstName: this.form.value['first-name'],
        lastName: this.form.value['last-name'],
        comment: this.form.value.comment,
        type: 'Interested'
      } }, 'confirm');
    }
  }
}
