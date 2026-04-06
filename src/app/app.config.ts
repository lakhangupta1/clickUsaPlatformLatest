import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ToastrModule } from 'ngx-toastr';
import { provideToastr } from 'ngx-toastr';


// icons
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';

// icons
// import { TablerIconsModule } from 'angular-tabler-icons';
// import * as TablerIcons from 'angular-tabler-icons/icons';

// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

//Import all material modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';

import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { NgxPermissionsModule, NgxPermissionsService,NgxPermissionsStore,USE_PERMISSIONS_STORE } from 'ngx-permissions';
import { AuthenticationService } from './services/authentication.service';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { SpinnerInterceptor } from './shared/interceptors/spinner.interceptor';


export function HttpLoaderFactory(http: HttpClient): any {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

export const appConfig: ApplicationConfig = {
  providers: [
    { provide : HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    { provide:HTTP_INTERCEPTORS,useClass:ErrorInterceptor,multi:true},
    { provide :HTTP_INTERCEPTORS,useClass:SpinnerInterceptor,multi:true},
    { provide: USE_PERMISSIONS_STORE, useValue: true },
    provideAnimationsAsync(), 
    provideToastr(), 
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),
    NgxPermissionsService,NgxPermissionsStore,
    {provide: USE_PERMISSIONS_STORE, useValue: true},
    AuthenticationService,
    provideHttpClient(withInterceptorsFromDi()),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      NgxPermissionsModule.forRoot(),
      CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
      FlatpickrModule.forRoot(),
      FormsModule,
      ToastrModule.forRoot(),
      ReactiveFormsModule,
      FeatherModule.pick(allIcons),
      NgScrollbarModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ],
};
