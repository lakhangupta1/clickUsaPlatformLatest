import { Routes } from "@angular/router";
import { OfferslistComponent } from "./offers-list/offers-list.component";
import { OffersDetailsComponent } from "./offers-details/offers-details.component";
import { OffersWorkingComponent } from "./offers-working/offers-working.component";

export const OffersRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'all',
                component: OfferslistComponent,
                data: {
                    title: 'Offers',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'All Offers ' }
                    ]
                }
            },
            {
                path: 'active',
                component: OfferslistComponent,
                data: {
                    title: 'Offers',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Active Offers' }
                    ]
                }
            },
            {
                path: 'private',
                component: OfferslistComponent,
                data: {
                    title: 'Offers',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Private Offers' }
                    ]
                }
            },
            {
                path: 'public',
                component: OfferslistComponent,
                data: {
                    title: 'Offers',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Public Offers' }
                    ]
                }
            },
            {
                path: 'detail/:id',
                component: OffersDetailsComponent,
                data: {
                    title: 'Offer Details',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Offer Details' }
                    ]
                }
            },
            {
                path: 'working',
                component: OffersWorkingComponent,
                data: {
                    title: 'Working Offers',
                    urls: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Working Offers' }
                    ]
                }
            }

        ]
    }
]