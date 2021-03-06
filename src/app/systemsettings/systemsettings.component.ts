import { Component, OnInit, Input, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Location, APP_BASE_HREF, isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { AlertService , SettingsService} from '../_services';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-systemsettings',
  templateUrl: './systemsettings.component.html',
  styleUrls: ['./systemsettings.component.css']
})
export class SystemSettingsComponent implements OnInit {

  config: string;
  settings: Object[] = [];
  isPlatformBrowser: boolean = false;

  constructor(
    private location: Location,
    private alertService: AlertService,
    private message: NzMessageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_BASE_HREF) private origin: string,
    private settingsService : SettingsService,
    private modalService: NzModalService
    ) {
      this.isPlatformBrowser = isPlatformBrowser(platformId) ? true : false;
    }

  ngOnInit() {
    this.getSettings();
  }

  getSettings(){
    this.config = JSON.parse(sessionStorage.getItem("Settings"));
    this.settingsService.loading().subscribe(settings => {
      this.settings = settings.slice(0, );
      for(let idx in this.settings){
        var json = JSON.parse(this.settings[idx]["Configuration"])
        var array = new Array();
        for(let key in json)
          array.push(key +":"+json[key]);
        this.settings[idx]["Configuration"] = array;
      }
    });
  }

  goBack(): void { this.location.back();}

  showConfirm(): void {
    this.modalService.confirm({
      nzTitle: '<i>请确认是否保存设置?</i>',
      nzOnOk: () => {this.save()}
    });
  }

  save() {
    this.settingsService.update(this.config).subscribe(
      data => {this.message.success("保存设置成功！",{nzDuration: 5000})},
      error =>{this.message.error("保存设置失败！",{nzDuration: 5000})});

    sessionStorage.removeItem("Settings");
    // TODO a better way refresh session
    this.loadSetting();
  }

  loadSetting(){
    if(null == sessionStorage.getItem("Settings")){
      this.settingsService.loading().subscribe(settings => {
        var array = [].concat(settings);
        let jsonStr = '{';
        for(let idx in array){
          let name = array[idx]["Name"];
          let value = array[idx]["Value"];
          jsonStr += "\""+name+"\":\""+value+"\",";
        }
        jsonStr = jsonStr.substring(0,jsonStr.length-1);
        jsonStr += '}';
        if(jsonStr.length > 2)
          sessionStorage.setItem("Settings",jsonStr);
      });
    }
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
