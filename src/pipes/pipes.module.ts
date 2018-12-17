import { NgModule } from '@angular/core';
import { FormatDate } from './format-date/format-date';
import { WeatherIcon } from './weather-icon/weather-icon';
@NgModule({
	declarations: [FormatDate,
    WeatherIcon],
	imports: [],
	exports: [FormatDate,
    WeatherIcon]
})
export class PipesModule {}
