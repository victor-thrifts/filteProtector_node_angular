import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
let isPlatBrowser = false;

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        isPlatBrowser = isPlatformBrowser(platformId) ? true : false;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (isPlatBrowser && localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}