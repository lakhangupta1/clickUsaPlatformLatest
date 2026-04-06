import { Routes } from '@angular/router';
import { PublisherComponent } from '../external/publisher/publisher.component';


export const ExternalRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path:'register',
        component:PublisherComponent
      }
     
    ]
  }
];
