import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventsService } from '../events.service';
import { Event } from './../event.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit , OnDestroy{
  myEvents: Event[];
  eventsSub: Subscription;
  isLoading = false;
  constructor(private eventsService: EventsService, private router: Router) { }

  ngOnInit() {
    this.eventsSub = this.eventsService.events.subscribe(events => {
      this.myEvents = events;
    });
  }
  ionViewWillEnter() {
    this.isLoading = true;
    this.eventsService.fetchMyEvents().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
  }

  onEdit(eventId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'events', 'tabs', 'my-events', 'edit', eventId]);
    console.log('Editing item', eventId);
  }

}
