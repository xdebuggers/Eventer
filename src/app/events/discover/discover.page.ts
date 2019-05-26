import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Event} from '../event.model';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy{

  loadedEvents: Event[];
  private eventsSub: Subscription;

  constructor(private eventservices: EventsService) { }

  ngOnInit() {

    this.eventsSub = this.eventservices.events.subscribe(events => {
      this.loadedEvents = events;
    });
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }  
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log(event.detail);

  }

}
;