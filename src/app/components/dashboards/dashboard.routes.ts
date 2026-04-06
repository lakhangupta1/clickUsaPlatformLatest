import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModarnComponent } from './modarn/modarn.component';


export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Publisher Dashboard',
          urls: [
            { title: 'Dashboard', url: '/' },
            { title: 'Dashboard' }
          ]
        }
      }
    ]
  }
];
