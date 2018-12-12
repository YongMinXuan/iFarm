import { QuestionfirstPageModule } from './../pages/questionfirst/questionfirst.module';
import { QuestionFirstPage } from './../pages/questionfirst/questionfirst';
import { QuestionPageModule } from './../pages/question/question.module';
import { QuestionPage } from './../pages/question/question';
import { DatabaseProvider } from './../providers/database/database.service';
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
import { HttpClientModule } from "@angular/common/http";





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
    // QuestionFirstPage,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    WeatherPageModule,
    QuestionPageModule,
    QuestionfirstPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WeatherPage,
    QuestionPage,
    QuestionFirstPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    DataService,
    Geolocation,
    WeatherProvider,
    DatabaseProvider,
    HttpModule,
  ]
})
export class AppModule {}