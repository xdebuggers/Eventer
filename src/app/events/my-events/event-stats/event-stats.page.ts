import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../../event.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { EventsService } from '../../events.service';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { switchMap } from 'rxjs/operators';
import { JoinedEventComments } from './../../../joined-events/joined-event.model';
import { JoinedEventsService } from './../../../joined-events/joined-events.service';

@Component({
  selector: 'app-event-stats',
  templateUrl: './event-stats.page.html',
  styleUrls: ['./event-stats.page.scss'],
})
export class EventStatsPage implements OnInit, OnDestroy {

  event: Event;
  joinedEventComments: JoinedEventComments[];
  isJoinable = false;
  isLoading = false;
  private eventSub: Subscription;
  private commentsSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private loadingCtrl: LoadingController,
    private loginService: LoginService,
    private alertCtrl: AlertController,
    private router: Router,
    private joinedEventsService: JoinedEventsService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('eventId')) {
        this.navCtrl.navigateBack('/events/tabs/discover');
        return;
      }
      this.isLoading = true;
      let fetchedUserId: string;
      this.loginService.userId.pipe(switchMap(userId => {
        if (!userId) {
          throw new Error('Found no user');
        }
        fetchedUserId = userId;
        return this.eventsService.getEvent(paramMap.get('eventId'))

      })).subscribe(event => {
        this.event = event;
        this.isJoinable = event.userId !== fetchedUserId;
        this.isLoading = false;
        this.commentsSub = this.joinedEventsService.fetchJoinedEventComments(event.id).subscribe(joinedEventComments => {
          this.joinedEventComments = joinedEventComments; });
      }, error => {
        this.alertCtrl.create({header: 'Ooops', message: 'Could not load the event', buttons: [{text: 'OK', handler: () => {
          this.router.navigate(['/events/tabs/discover']);
        }}]}).then(alertEl => {
          alertEl.present();
        });

      });
    });
  }
  ngOnDestroy() {
    if(this.eventSub) {
      this.eventSub.unsubscribe();
    }
    if (this.commentsSub) {
      this.commentsSub.unsubscribe();
    }
  }
  onDeleteEvent(evenetId: string) {
    this.loadingCtrl.create({
      message: 'Deleting your event...'
    }).then(loadingEl => {
      loadingEl.present();
      this.eventsService.deleteEvent(evenetId).subscribe(() => {
        loadingEl.dismiss();
        this.router.navigate(['/events/tabs/my-events']);
      });
    });
  }

}
