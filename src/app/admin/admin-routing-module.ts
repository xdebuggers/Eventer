import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPage } from './admin.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: AdminPage,
        children: [
            {
                path: '',
                redirectTo: '/admin/tabs/users',
                pathMatch: 'full'
            },
            {
                path: 'users',
                loadChildren: './users/users.module#UsersPageModule'
            },
            {
                path: 'events',
                loadChildren: './user-events/user-events.module#UserEventsPageModule'
            }
        ]
    }, {
        path: '',
        redirectTo: '/admin/tabs/users',
        pathMatch: 'full'
      }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
