import { Component, OnInit } from '@angular/core';
//
import { EventsService } from '../../events/events.service';
import { Event} from '../../events/event.model';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { LoginService } from './../../login/login.service';
@Component({
  selector: 'app-user-events',
  templateUrl: './user-events.page.html',
  styleUrls: ['./user-events.page.scss'],
})
export class UserEventsPage implements OnInit {

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
  deleteE(id:string){
    this.eventservices.deleteEvents(id)
    
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
