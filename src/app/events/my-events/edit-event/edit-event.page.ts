import { Component, OnInit } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../../events.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.page.html',
  styleUrls: ['./edit-event.page.scss'],
})
export class EditEventPage implements OnInit {

  event: Event;
  constructor(private route: ActivatedRoute, private eventsService: EventsService, private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/my-events');
        return;
      }
      this.event = this.eventsService.getEvent(paramMap.get('eventId'));
    });
  }

}
