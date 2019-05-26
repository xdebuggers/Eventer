import { Component, OnInit } from '@angular/core';
import { EventsService } from './../../events.service';


@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {


  constructor() { }

  ngOnInit() { 
  }

  onCreateEvent() {
    console.log('created');
  }


}
