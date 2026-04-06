import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authenticationService.currentUserValue;
    const accessToken = JSON.parse(localStorage.getItem('currentUser')); 
    const isLoggedIn = accessToken && accessToken.token;
    const isApiUrl = this.authenticationService.getSubDomain;

    if (isLoggedIn && isApiUrl && accessToken.token) {
     
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `${accessToken.token}` 
        }
      });
      return next.handle(clonedRequest); 
    }
    return next.handle(req); 
  }
}
