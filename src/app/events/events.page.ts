import { Component, OnInit } from '@angular/core';
import { EventsService } from './events.service';
import { EventO } from './event.model';
@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

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
