import { Component, OnInit, Input, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Location, APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AlertService } from '../_services';

class Settings{
  protectedFolder: string;
  exeName:  string;
  remark: string;
}


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: Settings;
  isPlatformBrowser: boolean = false;
  constructor(
    private location: Location,
    private http: HttpClient,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_BASE_HREF) private origin: string
    ) {
      this.isPlatformBrowser = isPlatformBrowser(platformId) ? true : false;
    }

  ngOnInit() {
    this.settings = new Settings();
  }

  goBack(): void {
    this.location.back();
  }

  save(protectedFolder, exeName, remark) {
    // console.log(protectedFolder);
    if(!protectedFolder) document.getElementById("filePath").style.display = "";
    if(!remark) document.getElementById("dis").style.display = "";
    if(!protectedFolder || !remark || !this.isPlatformBrowser) return;
    let origin = '';
    if(this.origin) origin = this.origin;
    this.settings.protectedFolder = protectedFolder;
    this.settings.exeName = exeName;
    this.settings.remark = remark;
    return this.http.put<Settings>(`${origin}/api/settings`, this.settings).pipe(
      tap(_=>this.log('puted settings')),
      catchError(this.handleError<Settings>(`update`))
    ).subscribe(()=>{
      alert("保存成功");
      // this.goBack()
    });
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

  /** Log a AcclogService message with the MessageService */
  private log(message: string) {
    this.alertService.error(`AcclogService: ${message}`);
  }

}
