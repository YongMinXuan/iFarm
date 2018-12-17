import { PipesModule } from './../../pipes/pipes.module';
import { WeatherIcon } from './../../pipes/weather-icon/weather-icon';
import { FormatDate } from './../../pipes/format-date/format-date';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WeatherPage } from './weather';

@NgModule({
  declarations: [
    WeatherPage,
  ],
  imports: [
    IonicPageModule.forChild(WeatherPage),
    PipesModule
  ],
})
export class WeatherPageModule {}
