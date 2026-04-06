import { Routes } from "@angular/router";
import { PostbackAddComponent } from "./postback-add/postback-add.component";
import { PostbackListComponent } from "./postback-list/postback-list.component";

export const PostbackRoutes: Routes = [
    {
        path: '',
        children:[
            {
                path: 'add/:id',
                component: PostbackAddComponent,
                data: {
                    title: 'Add Postback',
                    url: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Add Postback' }
                    ]
                }
            },
            {
                path: 'edit/:postback_id',
                component: PostbackAddComponent,
                data: {
                    title: 'Edit Postback',
                    url: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'Edit Postback' }
                    ]
                }
            },
            {
                path: 'list',
                component: PostbackListComponent,
                data: {
                    title: 'All Postback',
                    url: [
                        { title: 'Dashboard', url: '/' },
                        { title: 'All Postback' }
                    ]
                }
            }
        ]
    }
]