import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyEventsPage } from './my-events.page';
import { EventItemComponent } from './event-item/event-item.component';

const routes: Routes = [
  {
    path: '',
    component: MyEventsPage
  }
];

@NgModule({
  imports: [
  
  CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyEventsPage, EventItemComponent]
})
export class MyEventsPageModule {}
