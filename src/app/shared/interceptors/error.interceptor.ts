import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "src/app/services/authentication.service";
import { Observable, catchError, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
                if ([401, 403].includes(err.status)) {
                    const preVisitedPath = window.location.pathname;
                    if (!['/logout', '/login'].includes(preVisitedPath)) {
                        sessionStorage.setItem("preVisitedPath", preVisitedPath);
                    }
                    this.authenticationService.logout();
                    location.reload();
                }

                const error = err.error?.message || err.statusText;
                return throwError(() => new Error(error));
            })
        );
    }
}
