import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AdminPage } from './admin.page';
import { AdminRoutingModule } from './admin-routing-module';



@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AdminRoutingModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
