import { Injectable } from "@angular/core";
import { JoindEvent } from "./joined-event.model";
import { BehaviorSubject } from "rxjs";
import { LoginService } from "./../login/login.service";
import { take, tap, delay, switchMap, map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';

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
    const newJoined = new JoindEvent(
      Math.random().toString(),
      eventId,
      this.loginService.userId,
      eventName,
      eventImg,
      type,
      firstName,
      lastName,
      comment
    );
    return this.http.post<{name: string}>(this.fireBaseURL + '/joined-events.json',
    {...newJoined, id: null}
    ).pipe(switchMap(resData => {
      generatedId = resData.name;
      return this.joinedEvents;
    }), take(1),
    tap(joinedEvents => {
      newJoined.id = generatedId;
      this._joinedEvents.next(joinedEvents.concat(newJoined));
    }));
  }

  cancelJoinEvent(joinedEventId: string) {
    return this.http.delete(this.fireBaseURL + `/joined-events/${joinedEventId}.json`)
    .pipe(switchMap(() => {
      return this.joinedEvents;
    }),
    take(1),
    tap(joinedEvents => {
      this._joinedEvents.next(joinedEvents.filter(j => j.id !== joinedEventId));
    }));
  }

  fetchJoinedEvents() {
    return this.http.get<{[key: string]: JoinedEventData}>
    (this.fireBaseURL + `/joined-events.json?orderBy="userId"&equalTo="${this.loginService.userId}"`
    ).pipe(map(joinedEventData => {
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
