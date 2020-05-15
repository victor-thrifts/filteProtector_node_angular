import  { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { first, switchMap } from 'rxjs/operators';
import { interval, Subscription } from 'rxjs';
import { AuthenticationService, AlertService, UserService, SettingsService } from 'src/app/_services';
import { RouterLink, Router, ROUTER_CONFIGURATION } from '@angular/router';
import { isNull } from 'util';
import { AlertComponent } from '../message-alert/alert.component';

@Component({ selector: 'app-top-bar',
           templateUrl: './top-bar.component.html',
           styleUrls: ['./top-bar.component.css'],
})

export class TopBarComponent implements OnInit{
    title = 'FDS文件防控系统';

    loggedIn: boolean = false;
    Isadmin: boolean = false;
    user: string;
    token:string;
    private subscription: Subscription;

    constructor(
        @Inject(PLATFORM_ID) private platformId: string,
            private cdr: ChangeDetectorRef,
            private router: Router,
            private alertService: AlertService,
            private authenticationService: AuthenticationService,
            private settingsService : SettingsService
    ) {

        if(!isPlatformBrowser(platformId)) return;
        let currentUser = sessionStorage.getItem('currentUser');
        this.loggedIn = !isNull(currentUser);
        if(this.loggedIn){
            let {user, token} = JSON.parse(currentUser);
            this.user = user;
            this.token = token;
            this.user = user;
            if(user=="admin") {
                this.Isadmin = true;
            }
            else{
                this.Isadmin = false;
            }
        }

        // setInterval(() => {
        //     if(!isPlatformBrowser(platformId)) return;
        //     let currentUser = sessionStorage.getItem('currentUser');
        //     this.loggedIn = !isNull(currentUser);
        //     if(currentUser)
        //     {
        //         let {user, token} = JSON.parse(localStorage.getItem('currentUser'));
        //         this.user = user;
        //         this.token = token;
        //         this.user = user;
        //         if(user=="admin") {
        //             this.Isadmin = true;
        //         }
        //         else{
        //             this.Isadmin = false;
        //         }
        //     }
        //     this.cdr.detectChanges();
        // },1000);
    }

    ngOnInit() {
        if(!isPlatformBrowser(this.platformId)) return;
        this.loadSetting();
        this.subscription = this.alertService.getMessage().subscribe(message => {
            if(message && (message.type == 'message') ){
                let {loggedIn, Isadmin} = message.text;
                this.loggedIn = loggedIn;
                this.Isadmin = Isadmin;
                if(loggedIn){
                    let {user, token} = JSON.parse(sessionStorage.getItem('currentUser'));
                    this.user = user;
                    this.token = token;
                }
                this.cdr.detach();
                this.cdr.detectChanges();
                this.cdr.reattach();
            }
        });

    }

    ngOnDestroy() {
        if(!isPlatformBrowser(this.platformId)) return;
        this.subscription.unsubscribe();
    }

    logout(){
        if(!isPlatformBrowser(this.platformId)) return;
        this.authenticationService.logout();
        this.loggedIn = !isNull(sessionStorage.getItem('currentUser'));
        this.cdr.detectChanges();
        this.router.navigate(['login']);
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

}
