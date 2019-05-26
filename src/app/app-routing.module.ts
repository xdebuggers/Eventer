import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login/login.guard';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  {
    path: 'events',
    loadChildren: './events/events.module#EventsPageModule',
    canLoad: [LoginGuard]
  },
  {
    path: 'joined-events',
    loadChildren: './joined-events/joined-events.module#JoinedEventsPageModule',
    canLoad: [LoginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]
})
export class AppRoutingModule { }
