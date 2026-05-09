import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";
import { AddPaymentComponent } from "../payments/add-payment/add-payment.component";

export const OtherComponets: Routes = [
    {
        path: '',
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
                data: {
                    title: 'Publisher Profile',
                    url: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Publisher Profile' }
                    ]
                }
            },
        ]
    },
    {
        path: 'add-payment',
        component: AddPaymentComponent,
        data: {
            title: 'add payment',
            url: [
                { title: 'Dashboard', url: '/' },
                { title: 'add payment' }
            ]
        }
    }
] 