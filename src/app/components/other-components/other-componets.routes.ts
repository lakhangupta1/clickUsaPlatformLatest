import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile/profile.component";

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
    }
] 