import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Event } from './../event.model';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.page.html',
  styleUrls: ['./my-events.page.scss'],
})
export class MyEventsPage implements OnInit {
  myEvents: Event[];
  constructor(private eventsService: EventsService) { }

  ngOnInit() {
    this.myEvents = this.eventsService.events;
  }

}
