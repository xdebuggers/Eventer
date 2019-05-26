import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Event } from '../../event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
})
export class EventDetailPage implements OnInit {

  event: Event;
  constructor(private navCtrl: NavController, private route: ActivatedRoute, private eventsService: EventsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap =>{
    if (!paramMap.has('eventId')) {
      this.navCtrl.navigateBack('/events/tabs/discover');
      return;
    }
    this.event = this.eventsService.getEvent(paramMap.get('eventId'));
  });
  }

  onJoinEvent() {
    //this.router.navigateByUrl('/events/tabs/discover');
    this.navCtrl.navigateBack('/events/tabs/discover');
  }
}
