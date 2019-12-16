import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    @Inject(PLATFORM_ID) private platformId: Object;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let isPlatBrowser = isPlatformBrowser(this.platformId) ? true : false;
        if(!isPlatBrowser) return next.handle(request);
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: { 
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }

        return next.handle(request);
    }
}