import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Location } from '../../models/location/location';

@Injectable()
export class LocationServiceProvider {
  apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(public http: HttpClient) {}

  load(latitude: number, longtude: number): Observable<Location> {
    return this.http.get<Location>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longtude}&key=AIzaSyCStWuZ8Z2PFmw04iTjA1nr_gWZr9c81XM`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationService.ts');
  }
}