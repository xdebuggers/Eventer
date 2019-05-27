import { Injectable } from '@angular/core';

import { Event } from './event.model';
import { LoginService } from './../login/login.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface EventData {
  capacity: number;
  date: string;
  desc: string;
  goingCount: number;
  imgUrl: string;
  interestedCount: number;
  name: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private loginService: LoginService, private http: HttpClient) {}

  private _events = new BehaviorSubject<Event[]>([]);
  fireBaseURL = 'https://eventer-xdebuggers.firebaseio.com';

  get events() {
    return this._events.asObservable();
  }

  fetchEvents() {
    return this.http
      .get<{ [key: string]: EventData }>(this.fireBaseURL + '/my-events.json')
      .pipe(
        map(resData => {
          const events = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              events.push(
                new Event(
                  key,
                  resData[key].name,
                  resData[key].desc,
                  resData[key].imgUrl,
                  resData[key].capacity,
                  new Date(resData[key].date),
                  resData[key].goingCount,
                  resData[key].interestedCount,
                  resData[key].userId
                )
              );
            }
          }
          return events;
        }),
        tap(events => {
          this._events.next(events);
        })
      );
  }

  getEvent(id: string) {
    return this.http.get<EventData>(this.fireBaseURL + '/my-events/' + id + '.json'
    ).pipe(
      map(eventData => {
        return new Event(
          id,
          eventData.name,
          eventData.desc,
          eventData.imgUrl,
          eventData.capacity,
          new Date(eventData.date),
          eventData.goingCount,
          eventData.interestedCount,
          eventData.userId
        );
      })
    );
  }

  addEvent(name: string, desc: string, capacity: number, date: Date) {
    let generatedId: string;
    const newEvent = new Event(
      Math.random().toString(),
      name,
      desc,
      'https://cdn.zuerich.com/sites/default/files/styles/sharing/public/web_zuerich_home_topevents_1600x900.jpg',
      capacity,
      date,
      0,
      0,
      this.loginService.userId
    );
    // need to look again!!!!!
    return this.http
      .post<{ name: string }>(this.fireBaseURL, { ...newEvent, id: null })
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.events;
        }),
        take(1),
        tap(events => {
          newEvent.id = generatedId;
          this._events.next(events.concat(newEvent));
        })
      );
  }
  updateEvent(eventId: string, name: string, desc: string) {
    let updatedEvents: Event[];
    return this.events.pipe(
      take(1),
      switchMap(events => {
        if (!events || events.length <= 0){
          return this.fetchEvents();
        } else {
          return of(events);
        }
      }),
      switchMap(events => {
        const updatedEventIndex = events.findIndex(ev => ev.id === eventId);
        updatedEvents = [...events];
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
          oldEvent.userId
        );
        return this.http.put(
          this.fireBaseURL + '/my-events/' + eventId + '.json',
          { ...updatedEvents[updatedEventIndex], id: null }
        );
      }),
      tap(() => {
        this._events.next(updatedEvents);
      })
    );
  }
}

/*new Event('e1',
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
    new Date('2019-11-23 23:22'),0,0,'abc')*/
