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
                redirectTo: 'admin',
                pathMatch: 'full'
            },
            {
                path: 'usersss',
                loadChildren: './users/users.module#UsersPageModule'
            },
            {
                path: 'user-events',
                loadChildren: './user-events/user-events.module#UserEventsPageModule'
            }
        ]
    }, {
        path: '',
        redirectTo: 'admin',
        pathMatch: 'full'
      }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
