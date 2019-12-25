import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { en_US, NZ_I18N, NzI18nModule } from 'ng-zorro-antd/i18n';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ServerTransferStateModule,
    ModuleMapLoaderModule,
    NzI18nModule,
    NoopAnimationsModule,
 //   HttpClientModule
  ],
  providers: [
    // Add universal-only providers here
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [ AppComponent ],
})

export class AppServerModule {}