import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ModarnComponent } from './modarn/modarn.component';
import { authGuard } from 'src/app/helpers/auth.guard';
import { EmptyComponent } from '../empty/empty.component';


export const DashboardRoutes: Routes = [
  // {
  //   path: '',
  //   children: [
  //     {
  //       path: '',
  //       canActivate : [],
  //       component: EmptyComponent,
  //       data: {
  //         title: 'Empty Dashboard',
  //         urls: [
  //           { title: 'Empty', url: '/' },
  //           { title: 'Empty' }
  //         ]
  //       }
  //     }
  //   ]
  // },
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        canActivate : [authGuard],
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
