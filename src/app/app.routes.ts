import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { OperationalSupportComponent } from './pages/operational-support/operational-support';
import { IncidentsComponent } from './pages/incidents/incidents';
import { BillingComponent } from './pages/billing/billing';
import { Home } from './pages/home/home';
import { Services } from './pages/services/services';
import { Library } from './pages/library/library';
import { LearningHub } from './pages/learning-hub/learning-hub';
import { Support } from './pages/support/support';
import { IdeaHub } from './pages/idea-hub/idea-hub';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'services', component: Services },
      { path: 'library', component: Library },
      { path: 'learning-hub', component: LearningHub },
      { path: 'support', component: Support },
      { path: 'idea-hub', component: IdeaHub },
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
