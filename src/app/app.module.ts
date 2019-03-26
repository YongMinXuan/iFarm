import { GroupChatMulitpleImagePageModule } from './../pages/group-chat-mulitple-image/group-chat-mulitple-image.module';
import { GroupChatImagePageModule } from './../pages/group-chat-image/group-chat-image.module';
import { GroupChatImagePage } from './../pages/group-chat-image/group-chat-image';
import { ChatsPageModule } from './../pages/chats/chats.module';
import { RoomPageModule } from './../pages/room/room.module';
import { AddRoomPageModule } from './../pages/add-room/add-room.module';
import { ChatsPage } from './../pages/chats/chats';
import { WeatherIcon } from './../pipes/weather-icon/weather-icon';
import { CommentsPageModule } from './../pages/comments/comments.module';
import { FeedPageModule } from './../pages/feed/feed.module';
import { QuestionfirstPageModule } from './../pages/questionfirst/questionfirst.module';
import { QuestionFirstPage } from './../pages/questionfirst/questionfirst';
import { QuestionPageModule } from './../pages/question/question.module';
import { QuestionPage } from './../pages/question/question';
import { DatabaseProvider } from './../providers/database/database.service';
import { WeatherPageModule } from './../pages/weather/weather.module';
import { WeatherPage } from './../pages/weather/weather';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {FormsModule} from "@angular/forms";
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { WeatherProvider } from '../providers/weather/weather';
import { Geolocation } from '@ionic-native/geolocation';
import { HttpClientModule } from "@angular/common/http";
import { FeedPage } from '../pages/feed/feed';
import { CommentsPage } from '../pages/comments/comments';
import { Network } from "@ionic-native/network";
import { ForecastServiceProvider } from '../providers/weather-forcast/forecast.service';
import { AppConfig }    from '../config/app.config';
import { FormatDate } from '../pipes/format-date/format-date';
import { LocationServiceProvider } from '../providers/weather-forcast/location.service';
import { LoadingServiceProvider } from '../providers/weather-forcast/loading.service';
import { ToastServiceProvider } from '../providers/weather-forcast/toast.service';
import { MyApp } from './app.component';
import {AngularFireModule} from "angularfire2";
import {AngularFireAuthModule} from "angularfire2/auth";
import {AngularFireDatabaseModule} from 'angularfire2/database'
import {FIREBASE_CONFIG} from "./app.firebase.config";
import { DatetimePickerModule } from 'ion-datetime-picker';
import { VerticalTimelineModule } from 'angular-vertical-timeline';

//providers
import { AuthService } from '../providers/auth/auth.service';
import { DataService } from '../providers/data/data.service';
import firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { EventPage } from '../pages/event/event';
import { AddEventPage } from '../pages/add-event/add-event';
import { EventPageModule } from '../pages/event/event.module';
import { AddEventPageModule } from '../pages/add-event/add-event.module';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { CalendarModule } from "ion2-calendar";
import { DatePickerModule } from 'ionic-calendar-date-picker';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { RoomPage } from '../pages/room/room';
import { AddRoomPage } from '../pages/add-room/add-room';
import { IonicImageLoader } from 'ionic-image-loader';
import { ImagePicker } from '@ionic-native/image-picker';
import { IndividualchatPageModule } from '../pages/individualchat/individualchat.module';
// import { ImagepickerProvider } from '../providers/imagepicker/imagepicker';
import { Facebook } from '@ionic-native/facebook/ngx';



//initialise firebase
firebase.initializeApp(FIREBASE_CONFIG.firebase);
firebase.firestore().settings({
  timestampsInSnapshots: true
})

//new auto imports

@NgModule({
  declarations: [
    MyApp,
    // FeedPage,
    // CommentsPage
    // WeatherPage,
    // QuestionFirstPage,
    // FormatDate,
    // WeatherIcon,
    // EventPage,
    // AddEventPage
    // GroupChatImagePage
  ],
  imports: [
    // AngularFireModule.initializeApp(FIREBASE_CONFIG),
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    // AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    HttpModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    WeatherPageModule,
    QuestionPageModule,
    QuestionfirstPageModule,
    FeedPageModule,
    CommentsPageModule,
    EventPageModule,
    AddEventPageModule,
    DatetimePickerModule,
    CalendarModule,
    IonicModule,
    AngularFirestoreModule,
    AddRoomPageModule,
    RoomPageModule,
    ChatsPageModule,
    IonicImageLoader.forRoot(),
    GroupChatImagePageModule,
    GroupChatMulitpleImagePageModule,
    IndividualchatPageModule,
    VerticalTimelineModule

  ],
  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WeatherPage,
    QuestionPage,
    QuestionFirstPage,
    FeedPage,
    CommentsPage,
    EventPage,
    AddEventPage,
    GroupChatImagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    AuthService,
    DataService,
    Geolocation,
    WeatherProvider,
    DatabaseProvider,
    HttpModule,
    Firebase,
    Camera,
    ForecastServiceProvider,
    AppConfig,
    LocationServiceProvider,
    ToastServiceProvider,
    LoadingServiceProvider,
    Network,
    LocationAccuracy,
    ImagePicker,
    
    // ImagepickerProvider,
  ]
})
export class AppModule {}