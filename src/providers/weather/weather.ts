import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

@Injectable()
export class WeatherProvider {
  apiKey = 'a697f3f215be8e51b4253220abba3d7d';
  url;

  constructor(
    public http: Http,
    private geolocation: Geolocation
  ) {
    console.log('Hello WeatherProvider Provider');

  }
  async getPosition() {
    return await this.geolocation.getCurrentPosition();
  } 

  currentWeather(lon: number, lat: number): Observable<any> {
    const currentInfo = this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&APPID=a697f3f215be8e51b4253220abba3d7d`);
    const forecastInfo = this.http.get(`http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&units=metric&cnt=10&APPID=a697f3f215be8e51b4253220abba3d7d`);

    return Observable.forkJoin([currentInfo, forecastInfo])
      .map(responses => {
        return [].concat(...responses);
      });
  }

}
