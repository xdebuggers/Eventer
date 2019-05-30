import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsPage } from './events.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: EventsPage,
    children: [
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: './discover/discover.module#DiscoverPageModule'
          },
          {
            path: ':eventId',
            loadChildren:
              './discover/event-detail/event-detail.module#EventDetailPageModule'
          }
        ]
      },
      {
        path: 'my-events',
        children: [
          {
            path: '',
            loadChildren: './my-events/my-events.module#MyEventsPageModule'
          },
          {
            path: 'new',
            loadChildren:
              './my-events/new-event/new-event.module#NewEventPageModule'
          },
          {
            path: 'edit/:eventId',
            loadChildren:
              './my-events/edit-event/edit-event.module#EditEventPageModule'
          },
          {
            path: ':eventId',
            loadChildren:
              './my-events/event-stats/event-stats.module#EventStatsPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/events/tabs/discover',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/events/tabs/discover',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule {}
