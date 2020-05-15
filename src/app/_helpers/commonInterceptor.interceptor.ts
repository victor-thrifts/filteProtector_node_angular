import { Injectable,  Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const ignoreToken = ['login', 'logout', 'table'];
@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor(
    @Inject(PLATFORM_ID) private platformId: string)
    {
      //if(!isPlatformBrowser(platformId)) return;
    }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!isPlatformBrowser(this.platformId)) return;
    let currentUser = sessionStorage.getItem("currentUser");
    if(currentUser){
      let user = JSON.parse(currentUser);
      req = req.clone({
          headers: req.headers.set('username', user.user)
      })
    }
    return next.handle(req).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
          }
        },
        error => {
        })
    );
  }
}