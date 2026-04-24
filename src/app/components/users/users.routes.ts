import { Routes } from "@angular/router";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { UserListComponent } from "./user-list/user-list.component";
import { UserEditComponent } from "./user-edit/user-edit.component";
import { ngxPermissionsGuard } from "ngx-permissions";
import { AuthenticationGuard } from "../authentication/authentication.guard";
import { authGuard } from "src/app/helpers/auth.guard";
export const UserRoutes : Routes = [
    {
        path : '',
        children: [
            {
                path: 'user/details/:id',
                component: UserDetailsComponent,
                canActivate:[authGuard, ngxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['Admin'],
                        redirectTo: '/login'
                    },
                    title: 'Api Reference',
                    urls: [
                    { title: 'Dashboard', url: '/' },
                    { title: 'Api Reference' }
                    ]
                }
            },
            {
                path: 'user/edit/:id',
                component: UserEditComponent,
                canActivate:[authGuard, ngxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['Admin'],
                        redirectTo: '/login'
                    },
                    title: 'user details',
                    urls: [
                    { title: 'user ', url: '/' },
                    { title: 'user details' }
                    ]
                }
            },
            {
                path: 'user/edit',
                component: UserEditComponent,
                canActivate:[authGuard,ngxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['Admin'],
                        redirectTo: '/login'
                    },
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
                canActivate:[authGuard, ngxPermissionsGuard],
                data: {
                    permissions: {
                        only: ['Admin'],
                        redirectTo: '/login'
                    },
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