import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Event } from './../event.model';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  myEvents: Event[];
  constructor(private eventsService: EventsService, private router: Router) { }

  ngOnInit() {
    this.myEvents = this.eventsService.events;
  }
  onEdit(eventId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'events', 'tabs', 'my-events', 'edit', eventId]);
    console.log('Editing item', eventId);
  }

}
