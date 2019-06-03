import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { AuthenticateService } from './services/authentication.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { ReactiveFormsModule } from '@angular/forms';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAIFc7JPGXHudTSji1VnUWfKxX0CLTIvvA',
    authDomain: 'iot-smartoffice.firebaseapp.com',
    databaseURL: 'https://iot-smartoffice.firebaseio.com',
    projectId: 'iot-smartoffice',
    storageBucket: 'iot-smartoffice.appspot.com',
    messagingSenderId: '361920304502',
    appId: '1:361920304502:web:578e7c9d28961dfc'
  }
};
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    AngularFireModule,
    AngularFirestoreModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticateService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
