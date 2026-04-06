import { Routes } from "@angular/router";
import { PublisherApiDetailsComponent } from "./publisher-api-details/publisher-api-details.component";
import { PublisherApiResponseComponent } from "./publisher-api-response/publisher-api-response.component";



export const ApiRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: PublisherApiDetailsComponent,
        data: {
          title: 'Api Reference',
          urls: [
            { title: 'Dashboard', url: '/' },
            { title: 'Api Reference' }
          ]
        }
      },
      // {
      //   path: 'api-details',
      //   component: PublisherApiResponseComponent,
      //   data: {
      //     title: 'api-details',
      //     urls: [
      //       { title: 'Home', url: '/' },
      //       { title: 'api-details' }
      //     ]
      //   }
      // },
    ]
  }
];
