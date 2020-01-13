import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  SharedModule } from '../../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatButtonModule, MatGridListModule } from '@angular/material';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    MatGridListModule,
    MatButtonModule
  ]
})
export class LoginModule { }
