import { Component, OnInit } from '@angular/core';
//
import { EventsService } from '../../events/events.service';
import { Event} from '../../events/event.model';
import { Subscription } from 'rxjs';
import { SegmentChangeEventDetail } from '@ionic/core';
import { LoginService } from './../../login/login.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
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

  constructor(
    private eventservices: EventsService, 
    private loginService: LoginService, 
    private loadingCtrl: LoadingController,
    private eventsService: EventsService,
    private router: Router
    ) { }

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

  onDeleteEvent(evenetId: string) {
    this.loadingCtrl.create({
      message: 'Deleting your event...'
    }).then(loadingEl => {
      loadingEl.present();
      this.eventsService.deleteEvent(evenetId).subscribe(() => {
        loadingEl.dismiss();
        this.router.navigate(['/admin/tabs/user-events']);
      });
    });
  }
  
}
