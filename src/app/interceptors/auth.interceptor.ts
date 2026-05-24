import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { BehaviorSubject, Observable, throwError, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Proactively refresh if token is expired or expiring within 30 seconds
    if (token && this.isTokenExpired(token)) {
      return this.runRefreshThenRetry(req, next);
    }

    return next.handle(token ? this.attachToken(req, token) : req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Reactive fallback: server says token is expired
        const isTokenExpired = error.status === 401 && error.error?.msg === 'TOKEN_EXPIRED';
        if (isTokenExpired) {
          return this.runRefreshThenRetry(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  // Returns true if token is already expired or expires within 30 seconds
  private isTokenExpired(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const expiresAt = decoded.exp * 1000; // convert to ms
      return Date.now() >= expiresAt - 30_000;
    } catch {
      return true;
    }
  }

  private attachToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private runRefreshThenRetry(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isRefreshing) {
      // Queue request until in-flight refresh completes
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => next.handle(this.attachToken(req, token!)))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.authService.refreshToken().pipe(
      switchMap((response: any) => {
        this.isRefreshing = false;
        const newToken = response?.payload?.[0]?.token;
        this.refreshTokenSubject.next(newToken);
        return next.handle(this.attachToken(req, newToken));
      }),
      catchError((refreshError) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(null);
        this.authService.logout();
        return throwError(() => refreshError);
      })
    );
  }
}
