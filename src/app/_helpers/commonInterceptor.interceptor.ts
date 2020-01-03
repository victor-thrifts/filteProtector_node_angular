import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const ignoreToken = ['login', 'logout', 'table'];
@Injectable()
export class CommonInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
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