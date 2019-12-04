import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { AlertService } from '../_services/alert.service'

import { Keyreg } from '../_models';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable()
export class KeyregService {
    isPlatformBrowser: boolean;
    constructor(
        @Inject(PLATFORM_ID) private platformID: Object,
        @Optional() @Inject(APP_BASE_HREF) private origin: string,
        private http: HttpClient,
    ){
        this.isPlatformBrowser = isPlatformBrowser(platformID)? true: false;
        console.log(this.origin);
        console.log(origin);
    }

    register(keyreg: Keyreg): Observable<Keyreg> {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.post<Keyreg>(`${origin}/api/soft/register`, keyreg);
    }
}

