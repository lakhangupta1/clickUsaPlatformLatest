import { Route, Routes } from "@angular/router";
import { ReportComponent } from "./report/report.component";
import { ConversionComponent } from "./conversion/conversion.component";
import { GeoReportsComponent } from "./geo-reports/geo-reports.component";

export const StatisticsRoutes:Routes =[
    {
        path:'',
        children:[
            {
                path:'reports',
                component:ReportComponent,
                data:{
                    title:'Statistics',
                    urls:[
                        {title:'Dashboard',url:'/'},
                        {title:'Report'}
                    ]
                }
            },
            {
                path:'conversions',
                component:ConversionComponent,
                data:{
                    title:'Statistics',
                    urls:[
                        {title:'Dashboard',url:'/'},
                        {title:'Conversions'}
                    ]
                }
            },
            {
                path : 'geo-reports',
                component : GeoReportsComponent,
                data : {
                    title : 'geo-reports',
                    urls : [
                        { title : 'Dashboard', url : '/'},
                        { title : 'geo-report'}
                    ]
                }
            }
           
        ]
    }
    
        
]