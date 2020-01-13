import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingComponent } from './onboarding/onboarding.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'onboarding',
        loadChildren: './onboarding/onboarding.module#OnboardingModule'
      }
     /*  {
        path: 'maintenance/offline-ui',
        loadChildren: './theme/maintenance/offline-ui/offline-ui.module#OfflineUiModule'
      } */
    ]
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
