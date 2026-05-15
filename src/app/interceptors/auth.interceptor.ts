import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import {
  Observable,
  throwError
} from 'rxjs';

import {
  catchError,
  switchMap
} from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshing = false;

  constructor(
    private authService: AuthenticationService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');

    let authReq = req;

    // Add access token
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // Access token expired
        if (
          error.status === 401 &&
          !this.isRefreshing
        ) {

          this.isRefreshing = true;

          return this.authService.refreshToken().pipe(

            switchMap((response: any) => {
              this.isRefreshing = false;
              const newToken =
                response?.payload?.[0]?.token;
              localStorage.setItem(
                'token',
                newToken
              );
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next.handle(retryReq);
            }),

            catchError((refreshError) => {

              this.isRefreshing = false;

              // logout user
              this.authService.logout();

              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}