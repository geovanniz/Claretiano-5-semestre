import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UserListPage } from './user-list.page';
import { UserFormPage } from './user-form.page';

@NgModule({
  declarations: [UserListPage, UserFormPage],
  imports: [
    CommonModule, ReactiveFormsModule, IonicModule,
    RouterModule.forChild([
      { path: '',    component: UserListPage },
      { path: 'new', component: UserFormPage },
      { path: ':id', component: UserFormPage },
    ]),
  ],
})
export class UsersPageModule {}
