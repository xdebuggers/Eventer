import { Component, OnInit, OnDestroy } from '@angular/core';
import { JoinedEventsService } from './joined-events.service';
import { JoindEvent } from './joined-event.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-joined-events',
  templateUrl: './joined-events.page.html',
  styleUrls: ['./joined-events.page.scss'],
})
export class JoinedEventsPage implements OnInit, OnDestroy {

  loadedJoinedEvents: JoindEvent[];
  private joinedEventsSub: Subscription;
  constructor(private joinedEventsService: JoinedEventsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.joinedEventsSub = this.joinedEventsService.joinedEvents.subscribe(joinedEvents => {
      this.loadedJoinedEvents = joinedEvents;
    });
  }
  onUnjoinEvent(joinedEvenetId: string, slidingJevent: IonItemSliding) {
    slidingJevent.close();
    this.loadingCtrl.create({
      message: 'Caneling your joined event...'
    }).then(loadingEl => {
      loadingEl.present();
      this.joinedEventsService.cancelJoinEvent(joinedEvenetId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }
  ngOnDestroy() {
    if (this.joinedEventsSub) {
      this.joinedEventsSub.unsubscribe();
    }
  }

}
