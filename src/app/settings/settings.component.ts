import { Component, OnInit, Input, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Location, APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AlertService, LogAllService } from '../_services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    private message: NzMessageService,
    private modalService: NzModalService,
    private logAllService: LogAllService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_BASE_HREF) private origin: string
    ) {
      this.isPlatformBrowser = isPlatformBrowser(platformId) ? true : false;
    }

  ngOnInit() {
    this.settings = new Settings();
    this.logAllService.getOneByType(3).subscribe(data => {
      if(data && data.Details){
          this.settings = JSON.parse(data.Details);;
          console.log(this.settings);
      }
    });
    // this.settings.protectedFolder = localStorage.getItem('protectedFolder');
    // this.settings.exeName = localStorage.getItem('exeName');
  }

  goBack(): void {
    this.location.back();
  }

  showConfirm(protectedFolder, exeName, remark): void {
    this.modalService.confirm({
      nzTitle: '<i>请确认是否保存设置?</i>',
      nzOnOk: () => {this.save(protectedFolder, exeName, remark)}
    });
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
    // localStorage.setItem('protectedFolder', this.settings.protectedFolder);
    // localStorage.setItem('exeName', this.settings.exeName);
    return this.http.put<Settings>(`${origin}/api/settings`, this.settings).pipe(
      tap(_=>this.log('puted settings')),
      catchError(this.handleError<Settings>(`update`))
    ).subscribe(data=>{
      this.message.success("保存设置成功！,机算机将会重启使设置生效",{nzDuration: 5000})
      // this.goBack()
    },error => {
      this.message.error("保存设置失败！",{nzDuration: 5000})
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
