import { Injectable } from '@angular/core';
import { JoindEvent } from './joined-event.model';

@Injectable({ providedIn: 'root'})
export class JoinedEventsService {
    private _joinedEvents: JoindEvent[] = [
        new JoindEvent('xyz', 'e1', 'abc', 'startup', 10)
    ];

    get joinedEvents() {
        return [...this._joinedEvents];
    }


}