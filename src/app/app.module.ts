import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';

import {
  RoundProgressModule,
  ROUND_PROGRESS_DEFAULTS
  } from 'angular-svg-round-progressbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [RoundProgressModule,BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    PhotoLibrary,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{
    provide: ROUND_PROGRESS_DEFAULTS,
    useValue: {
      color: '#f00',
      background: '#0f0'
    }
  }],
  bootstrap: [AppComponent],
})
export class AppModule {}
