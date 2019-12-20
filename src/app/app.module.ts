import { NgModule }       from '@angular/core';
import { BrowserModule, TransferState }  from '@angular/platform-browser';
import { BrowserTransferStateModule, makeStateKey } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS }    from '@angular/common/http';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { AcclogDetailComponent }  from './acclog-detail/acclog-detail.component';
import { AcclogesComponent }      from './accloges/accloges.component';
import { AcclogSearchComponent }  from './acclog-search/acclog-search.component';
import { AcclogService }          from './_services/acclog.service';
import { LoginComponent } from './login/login.component';
import { UsersComponent } from './users/users.component';
import { RegisterComponent } from './register/register.component';
import { LogAllsComponent } from './logAll/logAlls.component';
import { AlertService, AuthenticationService, UserService, KeyregService,LogAllService } from './_services';

import { isPlatformBrowser, APP_BASE_HREF } from '@angular/common';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';

import { AlertComponent, TopBarComponent } from './_directives';
import { AuthGuard } from './_guards';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material'
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { SettingsComponent } from './settings/settings.component';
import { Registersoftware1Component } from './registersoftware1/registersoftware1.component';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
const RESULT_KEY = makeStateKey<string>('result');

@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'file-protector-view' }),
    BrowserTransferStateModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSidenavModule,
    NgZorroAntdModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    AcclogesComponent,
    AcclogDetailComponent,
    AcclogSearchComponent,
    LoginComponent,
    UsersComponent,
    AlertComponent,
    RegisterComponent,
    TopBarComponent,
    UserDetailComponent,
    SettingsComponent,
    Registersoftware1Component,
    LogAllsComponent,
  ],
  providers: [
    AcclogService,
    AuthenticationService,
    UserService,
    AlertService,
    AuthGuard,
    KeyregService,
    LogAllService,
    //{ provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: NZ_I18N, useValue: zh_CN },
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule {

  constructor(
    private tstate: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  )
  {
      let appId: string = Inject(APP_ID);
      const platform = isPlatformBrowser(platformId) ?
        'in the browser' : 'on the server';
      console.log(`Running ${platform} with appId=${appId}`);
      if(this.tstate.hasKey(RESULT_KEY)){
        // We are in the browser
        let aa = this.tstate.get(RESULT_KEY, '');
      }
      else{
         // No result received (browser)
         let aa = 'Im  not created in the server!';
      }
      this.tstate.onSerialize(RESULT_KEY,()=>{
        return 'Im created on the server!';
      })
  }

}
