import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { OperationalSupportComponent } from './pages/operational-support/operational-support';
import { IncidentsComponent } from './pages/incidents/incidents';
import { BillingComponent } from './pages/billing/billing';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'operational-support/incidents', pathMatch: 'full' },
      {
        path: 'operational-support',
        component: OperationalSupportComponent,
        children: [
          { path: '', redirectTo: 'incidents', pathMatch: 'full' },
          { path: 'incidents', component: IncidentsComponent }
        ]
      },
      { path: 'billing', component: BillingComponent }
    ]
  }
];
