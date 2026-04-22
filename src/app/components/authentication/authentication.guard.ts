import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NgxPermissionsService } from "ngx-permissions";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/services/authentication.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanActivateChild {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private permissionsService: NgxPermissionsService
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const currentUser = this.authenticationService.currentUserValue;
        console.log(" currentUser -> ", currentUser );
        // const domain = this.authenticationService.getDomain();
        // console.log("domain",domain);
        let token = localStorage.getItem('AccountToken') || localStorage.getItem('token');
        console.log(" token in auth -> ", token );
        const permissions = this.authenticationService.getUserDetails; 
        if (permissions) {
          // if (domain.indexOf('staging.') == 0 && domain === 'staging.' + permissions.userDetail.domain.dashboard) {
          //   this.permissionsService.loadPermissions(permissions.permissions);
          // } else if (domain === permissions.userDetail.domain.dashboard) {
          //   //  console.log("step-1")
          //   this.permissionsService.loadPermissions(permissions.permissions);
          // } else {
          //   localStorage.removeItem('AccountToken');
          //   localStorage.removeItem('currentUser');
          //   this.router.navigate(['/login']);
          //   return false;
          // }
        }
        
        // if (currentUser && this.authenticationService.getUserDetails['loginType'] == null) {
        //   return true;
        // }
        // if (currentUser && this.authenticationService.getUserDetails['loginType'] && token == null) {
        //   return true;
        // }
        // let lastLoginUrl = localStorage.getItem("lastLoginUrl")
        // if (lastLoginUrl !== '/logout' && lastLoginUrl) {
        //   this.router.navigate([lastLoginUrl]);
        // }
        // this.router.navigate(['/login']);
        return true;
      }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.canActivate(childRoute, state);
    }
}
