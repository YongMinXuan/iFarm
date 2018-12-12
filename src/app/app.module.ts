import { WeatherPageModule } from './../pages/weather/weather.module';
import { WeatherPage } from './../pages/weather/weather';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {FormsModule} from "@angular/forms";
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { WeatherProvider } from '../providers/weather/weather';
import { Geolocation } from '@ionic-native/geolocation';



import { MyApp } from './app.component';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {FIREBASE_CONFIG} from "./app.firebase.config";

//providers
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';

//new auto imports

@NgModule({
  declarations: [
    MyApp,
    // WeatherPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    WeatherPageModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WeatherPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    DataService,
    Geolocation,
    WeatherProvider,
    
  ]
})
export class AppModule {}