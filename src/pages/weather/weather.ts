import { Forecast } from './../../models/forecast/forecast';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { ForecastServiceProvider } from '../../providers/weather-forcast/forecast.service';
import { LocationServiceProvider } from '../../providers/weather-forcast/location.service';
import { Observable } from 'rxjs/Rx';
import { LoadingServiceProvider } from '../../providers/weather-forcast/loading.service';
import { ToastServiceProvider } from '../../providers/weather-forcast/toast.service';
import {forkJoin} from "rxjs/observable/forkJoin";

@IonicPage()
@Component({
  selector: 'weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  public location: any;
  public skycons: any;
  public forecast: Forecast;
  public locationName: string;
  public locationNamesp: string;

  public bgColorClassName: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public geolocation: Geolocation,
    private forecastServiceProvider: ForecastServiceProvider,
    private locationServiceProvider: LocationServiceProvider,
    private toastServiceProvider: ToastServiceProvider,
    private loadingServiceProvider: LoadingServiceProvider
  ) {}

  ionViewDidLoad() {
    this.loadingServiceProvider.show();

    this.geolocation.getCurrentPosition().then((location) => {
      this.location = location;
      console.log(this.location);
      console.log(this.location.coords.latitude);
      console.log(this.location.coords.longitude);
      Observable.forkJoin(
        this.forecastServiceProvider.load(this.location.coords.latitude, this.location.coords.longitude),
        this.locationServiceProvider.load(this.location.coords.latitude, this.location.coords.longitude)
      ).finally(
        () => {
          this.loadingServiceProvider.hide();
        }
      ).subscribe(
        (resources) => {
          this.forecast = resources[0];
          console.log(this.forecast);
          this.locationName = resources[1].results[2].formatted_address;
          this.locationNamesp = resources[1].results[1].address_components[2].long_name;
          console.log(this.locationNamesp);
          this.bgColorClassName = this.backgroundColorClassName();
        },
        (error) => {
          this.toastServiceProvider.error('Error occured during fetching data.')
        }
      );
    }).catch((error) => {
      this.loadingServiceProvider.hide();
      console.log('Error Here')
      this.toastServiceProvider.error('Error occured during fetching current location.')
    });
  }

  private backgroundColorClassName(): string {
    let result;
    const tempMax = this.forecast.daily.data[0].temperatureMax;

    if (tempMax >= 30) {
      result = 'very-warm';
    }
    else if (tempMax >= 20 && tempMax < 30) {
      result = 'warm';
    }
    else if (tempMax > 10 && tempMax < 20) {
      result = 'normal';
    }
    else if (tempMax > 0 && tempMax < 10) {
      result = 'cold';
    }
    else if (tempMax <= 0) {
      result = 'very-cold';
    }

    return result;
  }
}