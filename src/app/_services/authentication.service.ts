import { Injectable, Optional } from '@angular/core';
import { PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { APP_BASE_HREF } from '@angular/common';

let isPlatBrowser = false;

@Injectable()
export class AuthenticationService {
    constructor(private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(APP_BASE_HREF) private origin: string
    ) {
        isPlatBrowser = isPlatformBrowser(platformId) ? true : false;
    }

    login(username: string, password: string) {
        if(!isPlatBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.post<any>(`${origin}/api/users/authenticate`, { username: username, password: password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    if(isPlatBrowser) localStorage.setItem('currentUser', JSON.stringify(user));
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        if(isPlatBrowser) localStorage.removeItem('currentUser');
    }
}