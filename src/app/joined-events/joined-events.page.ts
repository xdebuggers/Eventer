import { Component, OnInit } from '@angular/core';
import { JoinedEventsService } from './joined-events.service';
import { JoindEvent } from './joined-event.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-joined-events',
  templateUrl: './joined-events.page.html',
  styleUrls: ['./joined-events.page.scss'],
})
export class JoinedEventsPage implements OnInit {

  loadedJoinedEvents: JoindEvent[];
  constructor(private joinedEventsService: JoinedEventsService) { }

  ngOnInit() {
    this.loadedJoinedEvents = this.joinedEventsService.joinedEvents;
  }
  onUnjoinEvent(joinedEvenetId: string, slidingJevent: IonItemSliding) {
    slidingJevent.close();

  }

}
