import { Routes } from '@angular/router';
import { NotfoundComponent } from './404/not-found.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ExternalLoginComponent } from './external-login/external-login.component';
import { AdvertiserSignupComponent } from './advertiser-signup/advertiser-signup.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '404',
        component: NotfoundComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'external/login',
        component: ExternalLoginComponent
      },

      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'advertiser/signup',
        component: AdvertiserSignupComponent
      }
    ]
  }
];
