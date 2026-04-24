
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);
    const permissionsService = inject(NgxPermissionsService);

    const currentUser = authService.currentUserValue;
    console.log("currentUser-- in authGuard -> ", currentUser );
    const domain = authService.getDomain();
    // console.log("domain---",domain)
    const token = localStorage.getItem('AccountToken');
    const permissions = authService.getUserDetails;
    console.log(" permissions in authGuard -> ", permissions );
    if (permissions) {
        if (permissions?.userDetail?.permissions?.length) {
            permissionsService.loadPermissions(permissions?.userDetail?.permissions);
        } else {
            router.navigate(['/login']);
            return false;
        }
    }
    console.log(" authService -> ", authService );
    console.log(" currentUser -> ", currentUser );
    if (currentUser && !authService.getUserDetails['loginType']) {
        return true;
    }

    if (currentUser && authService.getUserDetails['loginType'] && !token) {
        return true;
    }
    const lastLoginUrl = localStorage.getItem('lastLoginUrl');
    if (lastLoginUrl && lastLoginUrl !== '/logout') {
        router.navigate([lastLoginUrl]);
    } else {
        router.navigate(['/login']);
    }
    return false;
};

