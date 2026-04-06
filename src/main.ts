import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
// import { NgxPermissionsService, NgxPermissionsStore, USE_PERMISSIONS_STORE } from 'ngx-permissions'; // Import needed services
// import { provideHttpClient } from '@angular/common/http';
import "@angular/localize/init";

bootstrapApplication(AppComponent,appConfig).catch((err) => console.error(err));

 