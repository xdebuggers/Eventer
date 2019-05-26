import { Component, OnInit } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventsService } from '../../events.service';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.page.html',
  styleUrls: ['./event-stats.page.scss'],
})
export class EventStatsPage implements OnInit {

  event: Event;
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private eventsService: EventsService) { }

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
