import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import {SharedModule} from '../shared/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot()
  ]
})
export class OnboardingModule { }
