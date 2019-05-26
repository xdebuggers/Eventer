import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.page.html',
  styleUrls: ['./event-stats.page.scss'],
})
export class EventStatsPage implements OnInit, OnDestroy {

  event: Event;
  private eventSub: Subscription;
  constructor(private route: ActivatedRoute, private navCtrl: NavController, private eventsService: EventsService) { }
  ngOnDestroy() {
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
  }
  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/my-events');
        return;
      }
      this.eventSub = this.eventsService.getEvent(paramMap.get('eventId')).subscribe(event => {
        this.event = event;
      });

    });
  }
  

}
