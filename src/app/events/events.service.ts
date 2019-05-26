import { Injectable } from '@angular/core';

import {Event} from './event.model';
import { LoginService } from './../login/login.service';
import { BehaviorSubject } from 'rxjs';
import {take, map, tap, delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private _events = new BehaviorSubject<Event[]>([
    new Event('e1',
    'startup',
    'a very good startup',
    'https://cdn.zuerich.com/sites/default/files/styles/sharing/public/web_zuerich_home_topevents_1600x900.jpg',
    10,
    new Date('2019-01-01 23:22'),0,0,'abc'),

    new Event('e2',
    'Minturk',
    'A gather for the team',
    'https://pbs.twimg.com/media/Du5-syqW0AEqmJV.jpg',
    20,
    new Date('2020-12-01 17:22'),0,0,'a'),

    new Event('e3',
    'Iftar with friends',
    'a meet up with high school mates',
    'http://www.kentuckyteacher.org/wp-content/uploads/2015/11/151106Marsee-NextGenCouncil-9337.jpg',
    50,
    new Date('2019-11-23 23:22'),0,0,'abc')

  ]);

  get events() {
    return this._events.asObservable();

  }

  getEvent(id: string) {
    return this.events.pipe(take(1), map(events => {
      return {...events.find (p => p.id === id)};
    }));
  }

  addEvent(
        name: string,
        desc: string,
        capacity: number,
        date: Date) {
          const newEvent = new Event(Math.random().toString(),
          name,
          desc,
          'https://pbs.twimg.com/media/Du5-syqW0AEqmJV.jpg',
          capacity,
          date,
          0,
          0,
          this.loginService.userId);
          // need to look again!!!!!
          return this.events.pipe(take(1), delay(1000), tap((events) => {
              this._events.next(events.concat(newEvent));
          }));
  }
  updateEvent(eventId: string, name: string, desc: string) {
    return this.events.pipe(
      take(1),
      delay(1000),
      tap(events => {
      const updatedEventIndex = events.findIndex(ev => ev.id === eventId);
      const updatedEvents = [...events];
      const oldEvent = updatedEvents[updatedEventIndex];
      updatedEvents[updatedEventIndex] = new Event(
        oldEvent.id, 
        name, 
        desc, 
        oldEvent.imgUrl, 
        oldEvent.capacity, 
        oldEvent.date, 
        oldEvent.goingCount, 
        oldEvent.interestedCount, 
        oldEvent.userId);
      this._events.next(updatedEvents);
    }));
  }

  constructor(private loginService: LoginService) { }
}
