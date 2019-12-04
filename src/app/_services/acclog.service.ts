import { Injectable, Inject, Optional, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { PLATFORM_ID, APP_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Acclog } from '../_models/acclog';
import { AlertService } from './alert.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AcclogService {

  private acclogesUrl = 'api/accloges';  // URL to web api
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    @Optional() @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_ID) private appId: string,
    @Optional() @Inject(APP_BASE_HREF) private origin: string) {
        const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
        if(origin) this.acclogesUrl = `${origin}${this.acclogesUrl}`;
        const injector = Injector.create({providers:[{provide:APP_BASE_HREF, useValue: APP_BASE_HREF, deps: []}]});
        this.origin = injector.get(APP_BASE_HREF);
    }

  /** GET accloges from the server */
  getAccloges (start, cnt): Observable<Acclog[]> {
    const url = `${this.acclogesUrl}?start=${start}&count=${cnt}`;
    return this.http.get<Acclog[]>(url)
      .pipe(
        tap(accloges => this.log('fetched accloges')),
        catchError(this.handleError('getAccloges', []))
      );
  }

  /** GET acclog by id. Return `undefined` when id not found */
  getAcclogNo404<Data>(id: number): Observable<Acclog> {
    const url = `${this.acclogesUrl}/?id=${id}`;
    return this.http.get<Acclog[]>(url)
      .pipe(
        map(accloges => accloges[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} acclog id=${id}`);
        }),
        catchError(this.handleError<Acclog>(`getAcclog id=${id}`))
      );
  }

  /** GET acclog by id. Will 404 if id not found */
  getAcclog(id: number): Observable<Acclog> {
    const url = `${this.acclogesUrl}/${id}`;
    return this.http.get<Acclog>(url).pipe(
      tap(_ => this.log(`fetched acclog id=${id}`)),
      catchError(this.handleError<Acclog>(`getAcclog id=${id}`))
    );
  }

  /* GET accloges whose name contains search term */
  searchAccloges(term: string): Observable<Acclog[]> {
    if (!term.trim()) {
      // if not search term, return empty acclog array.
      return of([]);
    }
    return this.http.get<Acclog[]>(`${this.acclogesUrl}/?FileName=${term}`).pipe(
      tap(_ => this.log(`found accloges matching "${term}"`)),
      catchError(this.handleError<Acclog[]>('searchAccloges', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new acclog to the server */
  addAcclog (FileName: string): Observable<Acclog> {
    const acclog = { FileName };

    return this.http.post<Acclog>(this.acclogesUrl, acclog, httpOptions).pipe(
      tap((acclog: Acclog) => this.log(`added acclog w/ id=${acclog.rowid}`)),
      catchError(this.handleError<Acclog>('addAcclog'))
    );
  }

  /** DELETE: delete the acclog from the server */
  deleteAcclog (acclog: Acclog | number): Observable<Acclog> {
    const id = typeof acclog === 'number' ? acclog : acclog.rowid;
    const url = `${this.acclogesUrl}/${id}`;

    return this.http.delete<Acclog>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted acclog id=${id}`)),
      catchError(this.handleError<Acclog>('deleteAcclog'))
    );
  }

  /** PUT: update the acclog on the server */
  updateAcclog (acclog: Acclog): Observable<any> {
    return this.http.put(this.acclogesUrl, acclog, httpOptions).pipe(
      tap(_ => this.log(`updated acclog id=${acclog.rowid}`)),
      catchError(this.handleError<any>('updateAcclog'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
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

  /** Log a AcclogService message with the MessageService */
  private log(message: string) {
    this.alertService.error(`AcclogService: ${message}`);
  }
}
