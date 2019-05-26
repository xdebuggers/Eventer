import { Injectable } from '@angular/core';

import {Event} from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private _events: Event[] = [
    new Event('e1',
    'startup',
    'a very good startup',
    'https://cdn.zuerich.com/sites/default/files/styles/sharing/public/web_zuerich_home_topevents_1600x900.jpg',
    10,
    new Date('2019-01-01 23:22'),0,0),

    new Event('e2',
    'Minturk',
    'A gather for the team',
    'https://pbs.twimg.com/media/Du5-syqW0AEqmJV.jpg',
    20,
    new Date('2020-12-01 17:22'),0,0),

    new Event('e3',
    'Iftar with friends',
    'a meet up with high school mates',
    'http://www.kentuckyteacher.org/wp-content/uploads/2015/11/151106Marsee-NextGenCouncil-9337.jpg',
    50,
    new Date('2019-11-23 23:22'),0,0)

  ];

  get events(){
    return [...this._events]

  }

  getEvent(id: string) {
    return {...this._events.find (p => p.id === id)};
  }

  constructor() { }
}
