import { Component, OnInit } from '@angular/core';
import { EventsService } from '../events.service';
import { Event} from '../event.model';
import { from } from 'rxjs';
import { EventO } from '../event.model';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
/*
  loadedEvents: Event[];
  
  constructor(private eventservices: EventsService) { }

  ngOnInit() {

    this.loadedEvents = this.eventservices.events;
  }
*/
  eventO: EventO[];
  constructor(private eventOService: EventsService) { }

  ngOnInit() {
    this.eventOService.getEventO().subscribe(data => {
      this.eventO = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as EventO;
      })
    });
  }

  create(eventO: EventO){
      this.eventOService.createEventO(eventO);
  }

  update(eventO: EventO) {
    this.eventOService.updateEventO(eventO);
  }

  delete(id: string) {
    this.eventOService.deleteEventO(id);
  }

  
}
