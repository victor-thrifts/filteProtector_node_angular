import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { AlertService } from '../_services/alert.service'

import { User } from '../_models';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserService {
    isPlatformBrowser: boolean = false;
    constructor(
        private http: HttpClient,
        private alertService: AlertService,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(APP_BASE_HREF) private origin: string
    ) {
        this.isPlatformBrowser = isPlatformBrowser(platformId) ? true : false;
    }

    getAll(): Observable<User[]> {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.get<User[]>(`${origin}/api/users`).pipe(
          tap(_ => this.log(`fetched users`)),
          catchError(this.handleError<User[]>(`getAll`))
        );
    }

    getById(id: number): Observable<User> {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.get<User>(`${origin}/api/users/` + id).pipe(
            tap(_ => this.log(`fetched user`)),
            catchError(this.handleError<User>(`getById`))
        );
    }

    register(user: User): Observable<User> {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.post<User>(`${origin}/api/users/register`, user);
    }

    update(user: User) {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        return this.http.put(`${origin}/api/users/${user.rowid}`, user).pipe(
            tap(_=>this.log('puted user')),
            catchError(this.handleError<User>(`update`))
        )
    }

    delete(id: number) {
        if(!this.isPlatformBrowser) return;
        let origin = '';
        if(this.origin) origin = this.origin;
        console.log(`${origin}/api/users/` + id);
        return this.http.delete(`${origin}/api/users/` + id);
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
