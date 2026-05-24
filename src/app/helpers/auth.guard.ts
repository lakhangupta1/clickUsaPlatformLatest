
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthenticationService);
    const permissionsService = inject(NgxPermissionsService);

    const currentUser = authService.currentUserValue;
    const token = localStorage.getItem('token') || localStorage.getItem('AccountToken');

    // Not logged in — redirect to login
    if (!currentUser || !token) {
        router.navigate(['/login']);
        return false;
    }

    // Load permissions from JWT (backend may place them inside userDetail or at top level)
    const decoded = authService.getUserDetails;
    const perms: string[] =
        decoded?.userDetail?.permissions ||
        (Array.isArray(decoded?.permissions) ? decoded.permissions : []);
    if (perms.length) {
        permissionsService.loadPermissions(perms);
    }

    return true;
};

