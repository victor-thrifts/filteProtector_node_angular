import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { AlertService } from '../_services/alert.service'

import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class SettingsService {
    isPlatformBrowser: boolean = false;
    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(APP_BASE_HREF) private origin: string
    ) {
        this.isPlatformBrowser = isPlatformBrowser(platformId) ? true : false;
    }

    loading(): Observable<Object[]> {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.get<Object[]>(`${origin}/api/setting/loading`).pipe(
          tap(_ => this.log(`fetched loading`)),
          catchError(this.handleError<Object[]>(`loading`))
        );
    }

  update(config: Object) {
    if(!this.isPlatformBrowser) return;
    let origin = '';
    if(this.origin) origin = this.origin;
    return this.http.put(`${origin}/api/setting/update/`, config).pipe(
      tap(_=>this.log('puted user')),
      catchError(this.handleError(`update`))
    )
  }

    private log(message: string) {
        this.alertService.error(`UsersService: ${message}`);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // TODO: better job of transforming error for user consumption
          this.log(`${operation} failed: ${error.message}`);

          // Let the app keep running by returning an empty result.
          return of(result as T);
        };
    }

}
