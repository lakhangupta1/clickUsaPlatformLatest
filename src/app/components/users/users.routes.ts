import { Routes } from "@angular/router";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UserListComponent } from "./user-list/user-list.component";

export const UserRoutes : Routes = [
    {
        path : '',
        children: [
            {
                path: 'user/details/:id',
                component: UserDetailsComponent,
                data: {
                    title: 'Api Reference',
                    urls: [
                    { title: 'Dashboard', url: '/' },
                    { title: 'Api Reference' }
                    ]
                }
            },
            {
                path: 'user/details',
                component: UserDetailsComponent,
                data: {
                    title: 'user details',
                    urls: [
                    { title: 'user ', url: '/' },
                    { title: 'user details' }
                    ]
                }
            },
            {
                path: 'list/user',
                component: UserListComponent,
                data: {
                    title: 'user list',
                    urls: [
                    { title: 'user ', url: '/' },
                    { title: 'user list' }
                    ]
                }
            },
        ]
    }

]