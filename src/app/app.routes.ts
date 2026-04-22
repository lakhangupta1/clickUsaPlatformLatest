import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthenticationGuard } from './components/authentication/authentication.guard';


export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate: [],
    canActivateChild: [],
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./components/dashboards/dashboard.routes').then(
            (m) => m.DashboardRoutes
          ),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./components/offers/offers.routes').then(
            (m) => m.OffersRoutes
          ),
      },
      {
        path: 'statistics',
        loadChildren: () =>
          import('./components/statistics/statistics.routes').then(
            (m) => m.StatisticsRoutes
          )
      },
      {
        path: 'api-details',
        loadChildren: () =>
          import('./components/api-details/api-details.routes').then(
            (m) => m.ApiRoutes
          ),
      },
      {
        path: 'postback',
        loadChildren: () =>
          import('./components/postback/postback.routes').then(
            (m) => m.PostbackRoutes
          )
      },
      {
        path: '',
        loadChildren: () =>
          import('./components/other-components/other-componets.routes').then(
            (m) => m.OtherComponets
          )
      }

    ],
  },

  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
      {
        path: '',
        loadChildren: () => import('./components/external/external.routes').then(
          (m) => m.ExternalRoutes
        )
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },

];
