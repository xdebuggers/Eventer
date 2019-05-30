import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: AdminPage,
    children: [
      {
        path: 'user-events',
        children: [
          {
            path: '',
            loadChildren:
              './user-events/user-events.module#UserEventsPageModule'
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: './users/users.module#UsersPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/admin/tabs/user-events',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/admin/tabs/user-events',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
