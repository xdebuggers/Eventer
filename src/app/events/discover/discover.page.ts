import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Event} from '../event.model';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { LoginService } from './../../login/login.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy{

  loadedEvents: Event[];
  releventEvents: Event[];
  isLoading = false;
  private eventsSub: Subscription;

  constructor(private eventservices: EventsService, private loginService: LoginService) { }

  ngOnInit() {

    this.eventsSub = this.eventservices.events.subscribe(events => {
      this.loadedEvents = events;
      this.releventEvents = this.loadedEvents;
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.eventservices.fetchEvents().subscribe(() => {
      this.isLoading = false;
    });
  }


  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }
  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.releventEvents = this.loadedEvents;
    } else {
      this.releventEvents = this.loadedEvents.filter(
        event => event.userId !== this.loginService.userId);
    }

  }

}
;