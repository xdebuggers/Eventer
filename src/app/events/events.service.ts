import { Injectable } from '@angular/core';

import { Event } from './event.model';
import { LoginService } from './../login/login.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EventLocation } from './location.model';

interface EventData {
  capacity: number;
  date: string;
  desc: string;
  goingCount: number;
  imgUrl: string;
  interestedCount: number;
  name: string;
  userId: string;
  location: EventLocation;
}


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private loginService: LoginService, private http: HttpClient) {}

  private _events = new BehaviorSubject<Event[]>([]);
  fireBaseURL = 'https://eventer-app-xdebuggers.firebaseio.com';

  get events() {
    return this._events.asObservable();
  }

  deleteEvents(id: string){
    this.http.delete(this.fireBaseURL + '/my-events/' + id + '.json').subscribe();

  }
  

  fetchEvents() {
    return this.loginService.token.pipe(take(1), switchMap(token => {
      //console.log(this.fireBaseURL + `/my-events.json?auth=${token}`);
      return this.http
      .get<{ [key: string]: EventData }>(this.fireBaseURL + `/my-events.json?auth=${token}`)
    }),
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
                  resData[key].userId,
                  resData[key].location
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

  fetchMyEvents() {
    let fetchedUserId: string;
    return this.loginService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('User not found');
      }
      fetchedUserId = userId;
      return this.loginService.token;
    }), take(1), switchMap(token => {
      return this.http.get<{ [key: string]: EventData }>
    (this.fireBaseURL + `/my-events.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
    );
    }),
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
                  resData[key].userId,
                  resData[key].location
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
    return this.loginService.token.pipe(take(1), switchMap(token => {
      return this.http.get<EventData>(this.fireBaseURL + `/my-events/${id}.json?auth=${token}`);
    }),
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
          eventData.userId,
          eventData.location
        );
      })
    );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    return this.loginService.token.pipe(take(1), switchMap(token => {
      return this.http
    .post<{imageUrl: string, imagePath: string}>
    ('https://us-central1-eventer-app-xdebuggers.cloudfunctions.net/storeImage',
    uploadData, { headers: { Authorization: 'Bearer ' + token } });
    }));
  }

  addEvent(name: string, desc: string, capacity: number, date: Date, location: EventLocation, imageUrl: string) {
    let generatedId: string;
    let newEvent: Event;
    let fetchedUserId;
    return this.loginService.userId.pipe(take(1), switchMap(userId => {
      fetchedUserId = userId;
      return this.loginService.token;
    }) , take(1), switchMap(token => {
      if (!fetchedUserId) {
        throw new Error('no user found');
      }

      newEvent = new Event(
        Math.random().toString(),
        name,
        desc,
        imageUrl,
        capacity,
        date,
        0,
        0,
        fetchedUserId,
        location
      );
      // need to look again!!!!!
      return this.http
        .post<{ name: string }>(this.fireBaseURL + `/my-events.json?auth=${token}`, { ...newEvent, id: null })

    }), switchMap(resData => {
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
    let fetchedToken;
    return this.loginService.token.pipe(take(1), switchMap(token => {
      fetchedToken = token;
      return this.events;
    }),
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
          oldEvent.userId,
          oldEvent.location
        );
        return this.http.put(
          this.fireBaseURL + `/my-events/${eventId}.json?auth=${fetchedToken}`,
          { ...updatedEvents[updatedEventIndex], id: null }
        );
      }),
      tap(() => {
        this._events.next(updatedEvents);
      })
    );
  }

  updateEventCounts(eventId: string, type: string) {
    let updatedEvents: Event[];
    let fetchedToken;
    return this.loginService.token.pipe(take(1), switchMap(token => {
      fetchedToken = token;
      return this.events;
    }),
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
        if (type === 'Going') {
          oldEvent.goingCount++;
          //console.log(oldEvent.goingCount);
        } else {
          oldEvent.interestedCount++;
        }
        updatedEvents[updatedEventIndex] = new Event(
          oldEvent.id,
          oldEvent.name,
          oldEvent.desc,
          oldEvent.imgUrl,
          oldEvent.capacity,
          oldEvent.date,
          oldEvent.goingCount,
          oldEvent.interestedCount,
          oldEvent.userId,
          oldEvent.location
        );
        return this.http.put(
          this.fireBaseURL + `/my-events/${eventId}.json?auth=${fetchedToken}`,
          { ...updatedEvents[updatedEventIndex], id: null }
        );
      }),
      tap(() => {
        this._events.next(updatedEvents);
      })
    );
  }

  deleteEvent(eventId: string) {
    return this.loginService.token.pipe(take(1), switchMap(token => {
      return this.http.delete(this.fireBaseURL + `/my-events/${eventId}.json?auth=${token}`);
    }), switchMap(() => {
      return this.events;
    }),
    take(1),
    tap(events => {
      this._events.next(events.filter(e => e.id !== eventId));
    }));
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
