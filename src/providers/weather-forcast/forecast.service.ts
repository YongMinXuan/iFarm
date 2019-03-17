import { Forecast } from './../../models/forecast/forecast';
import { AppConfig } from './../../config/app.config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';



@Injectable()
export class ForecastServiceProvider {
  apiUrl = '/api/forecast';
  constructor( public http: HttpClient, private appConfig: AppConfig) {}

  load(latitude: number, longtude: number): Observable<Forecast> {
    console.log('hello');
    return this.http.get<Forecast>(`https://ifarmfyp.herokuapp.com/https://api.darksky.net/forecast/ae10fe3f2dcb03263f7dfefd15aba61c/${latitude},${longtude}?units=si`);
  }
  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad Forcast Service.ts');
  // }
}