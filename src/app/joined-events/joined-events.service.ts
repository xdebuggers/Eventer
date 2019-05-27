import { Injectable } from "@angular/core";
import { JoindEvent } from "./joined-event.model";
import { BehaviorSubject } from "rxjs";
import { LoginService } from "./../login/login.service";
import { take, tap, delay } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class JoinedEventsService {
  constructor(private loginService: LoginService) {}
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
    return this.joinedEvents.pipe(
      take(1),
      delay(1000),
      tap(joinedEvents => {
        this._joinedEvents.next(joinedEvents.concat(newJoined));
      })
    );
  }

  cancelJoinEvent(joinedEventId: string) {
    return this.joinedEvents.pipe(
      take(1),
      delay(1000),
      tap(joinedEvents => {
        this._joinedEvents.next(
          joinedEvents.filter(j => j.id !== joinedEventId)
        );
      })
    );
  }
}
