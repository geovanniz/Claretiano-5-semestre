import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SalesPage } from './sales.page';

@NgModule({
  declarations: [SalesPage],
  imports: [
    CommonModule, IonicModule,
    RouterModule.forChild([{ path: '', component: SalesPage }])
  ],
})
export class SalesPageModule {}
