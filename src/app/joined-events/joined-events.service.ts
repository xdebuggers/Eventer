import { Injectable } from "@angular/core";
import { JoindEvent } from "./joined-event.model";
import { BehaviorSubject } from "rxjs";
import { LoginService } from "./../login/login.service";
import { take, tap, switchMap, map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
import { Event } from '../events/event.model';

interface JoinedEventData {
  comment: string;
  eventId: string;
  eventImg: string;
  eventName: string;
  firsName: string;
  lastName: string;
  type: string;
  userId: string;
}


@Injectable({ providedIn: "root" })
export class JoinedEventsService {

  constructor(
    private loginService: LoginService,
    private http: HttpClient
    ) {}

  fireBaseURL = 'https://eventer-app-xdebuggers.firebaseio.com';
  private _joinedEvents = new BehaviorSubject<JoindEvent[]>([]);

  get joinedEvents() {
    return this._joinedEvents.asObservable();
  }

  joinEvent(
    eventId: string,
    eventName: string,
    eventImg: string,
    firstName: string,
    lastName: string,
    comment: string,
    type: string
  ) {
    let generatedId: string;
    let newJoined: JoindEvent;
    let fetchedUserId: string;
    return this.loginService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No user id found');
      }
      fetchedUserId = userId;
      return this.loginService.token;  
    }), 
    take(1),
    switchMap(token => {
      newJoined = new JoindEvent(
        Math.random().toString(),
        eventId,
        fetchedUserId,
        eventName,
        eventImg,
        type,
        firstName,
        lastName,
        comment
      );
      return this.http.post<{name: string}>(this.fireBaseURL + `/joined-events.json?auth=${token}`,
      {...newJoined, id: null}
      );
    }),
    switchMap(resData => {
      generatedId = resData.name;
      return this.joinedEvents;
    }), take(1),
    tap(joinedEvents => {
      newJoined.id = generatedId;
      this._joinedEvents.next(joinedEvents.concat(newJoined));
    }));
  }

  cancelJoinEvent(joinedEventId: string) {
    return this.loginService.token.pipe(take(1), switchMap(token => {
      return this.http.delete(this.fireBaseURL + `/joined-events/${joinedEventId}.json?auth=${token}`);
    }), switchMap(() => {
      return this.joinedEvents;
    }),
    take(1),
    tap(joinedEvents => {
      this._joinedEvents.next(joinedEvents.filter(j => j.id !== joinedEventId));
    }));
  }

  fetchJoinedEvents() {

    let fetchedUserId: string;
    return this.loginService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('User not found');
      }
      fetchedUserId = userId;
      return this.loginService.token;
    }), take(1), switchMap(token => {
      return this.http.get<{[key: string]: JoinedEventData}>
    (this.fireBaseURL + `/joined-events.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
    );
    }), map(joinedEventData => {
      const joinedEvents = [];
      for (const key in joinedEventData) {
        if (joinedEventData.hasOwnProperty(key)) {
          joinedEvents.push(new JoindEvent(
            key,
            joinedEventData[key].eventId,
            joinedEventData[key].userId,
            joinedEventData[key].eventName,
            joinedEventData[key].eventImg,
            joinedEventData[key].type,
            joinedEventData[key].firsName,
            joinedEventData[key].lastName,
            joinedEventData[key].comment
          ));
        }
      }
      return joinedEvents;
    }), tap(joinedEvents => {
      this._joinedEvents.next(joinedEvents);
    })
      );
  }

}
