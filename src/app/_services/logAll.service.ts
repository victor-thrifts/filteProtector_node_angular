import { Injectable, Inject, Optional, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { PLATFORM_ID, APP_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders }from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AlertService } from './alert.service';
import { PageInfo } from '../_models/pageInfo';
import { LogAll } from '../_models/logAll';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LogAllService {

  private logAllsUrl = 'api/logAlls';  // URL to web api
  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    @Optional() @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_ID) private appId: string,
    @Optional() @Inject(APP_BASE_HREF) private origin: string) {
        const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
        if(origin) this.logAllsUrl = `${origin}${this.logAllsUrl}`;
        const injector = Injector.create({providers:[{provide:APP_BASE_HREF, useValue: APP_BASE_HREF, deps: []}]});
        this.origin = injector.get(APP_BASE_HREF);
    }

  /** GET logAlles from the server */
  getLogAlls (page, pageSize,logAllForm): Observable<LogAll[]> {
    const url = `${this.logAllsUrl}?page=${page}&pageSize=${pageSize}&Ip=${logAllForm.Ip}&Module=${logAllForm.Module}&UserName=${logAllForm.UserName}&dateArray=${logAllForm.dateArray}`;
    return this.http.get<LogAll[]>(url)
      .pipe(
        tap(logAlls => this.log('fetched logAlls')),
        catchError(this.handleError('getLogAlls', []))
      );
  }

  getLogAllCountByQuery (logAllForm): Observable<PageInfo> {
    const url = `${this.logAllsUrl}/getCountByQuery?Ip=${logAllForm.Ip}&Module=${logAllForm.Module}&UserName=${logAllForm.UserName}&dateArray=${logAllForm.dateArray}`;
    return this.http.get<PageInfo>(url)
      .pipe(
        tap(count => this.log('fetched logAlls')),
        catchError(this.handleError<PageInfo>('getLogAllCount'))
      );
  }

  /** GET logAll by id. Return `undefined` when id not found */
  getLogAllNo404<Data>(id: number): Observable<LogAll> {
    const url = `${this.logAllsUrl}/?id=${id}`;
    return this.http.get<LogAll[]>(url)
      .pipe(
        map(logAlls => logAlls[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} LogAll id=${id}`);
        }),
        catchError(this.handleError<LogAll>(`getLogAllNo404 id=${id}`))
      );
  }

  /** GET logAll by id. Will 404 if id not found */
  getLogAll(id: number): Observable<LogAll> {
    const url = `${this.logAllsUrl}/${id}`;
    return this.http.get<LogAll>(url).pipe(
      tap(_ => this.log(`fetched LogAll id=${id}`)),
      catchError(this.handleError<LogAll>(`getLogAll id=${id}`))
    );
  }

  /* GET logAlls whose name contains search term */
  searchLogAlls(term: string): Observable<LogAll[]> {
    if (!term.trim()) {
      // if not search term, return empty logAll array.
      return of([]);
    }
    return this.http.get<LogAll[]>(`${this.logAllsUrl}/?Ip=${term}`).pipe(
      tap(_ => this.log(`found logAlls matching "${term}"`)),
      catchError(this.handleError<LogAll[]>('searchLogAlls', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new logAll to the server */
  insertLogAll(logAll: LogAll): Observable<LogAll> {
    console.log(logAll);
    return this.http.post<LogAll>(`${this.logAllsUrl}/insertLogAll`, logAll).pipe(
      tap(_ => this.log(`insertLogAll "${logAll}"`)),
      catchError(this.handleError<LogAll>('insertLogAll'))
    );
  }

  addlogAll (FileName: string): Observable<LogAll> {
    const logAll = { FileName };
    return this.http.post<LogAll>(this.logAllsUrl, logAll, httpOptions).pipe(
      tap((logAll: LogAll) => this.log(`added logAll w/ id=${logAll.rowid}`)),
      catchError(this.handleError<LogAll>('addLogAll'))
    );
  }

  /** DELETE: delete the logAll from the server */
  deletelogAll (logAll: LogAll | number): Observable<LogAll> {
    const id = typeof logAll === 'number' ? logAll : logAll.rowid;
    const url = `${this.logAllsUrl}/${id}`;

    return this.http.delete<LogAll>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted LogAll id=${id}`)),
      catchError(this.handleError<LogAll>('deleteLogAll'))
    );
  }

  /** PUT: update the logAll on the server */
  updatelogAll (logAll: LogAll): Observable<any> {
    return this.http.put(this.logAllsUrl, logAll, httpOptions).pipe(
      tap(_ => this.log(`updated LogAll id=${logAll.rowid}`)),
      catchError(this.handleError<any>('updateLogAll'))
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

  /** Log a logAllService message with the MessageService */
  private log(message: string) {
    this.alertService.error(`logAllService: ${message}`);
  }
}
