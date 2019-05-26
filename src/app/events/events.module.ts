import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsRoutingModule } from './events-routing-module';
import { IonicModule } from '@ionic/angular';
import { EventsPage } from './events.page';


@NgModule({
  imports: [
  CommonModule,
  IonicModule,
  EventsRoutingModule
],
  declarations: [EventsPage]
})

export class EventsPageModule {}
