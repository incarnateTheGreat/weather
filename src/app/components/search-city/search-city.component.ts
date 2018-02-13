import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

import { GetWeatherService } from '../../services/get-weather.service';

interface CityResult {
	name: string,
	country: string,
	lng: string,
	lat: string
}

interface CityWeather {
	currently?: {
		summary?: string,
		time?: any,
		icon?: string,
		temperature?: number,
		windSpeed?: number,
		windBearing?: number,
		windDirection?: string,
		humidity?: number,
	},
	today?: {
		sunrise?: any,
		sunset?: any
	}
}

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit {
	city: string = 'Toronto';
	cityObj: Object;
	cities: Object[] = [{
		city: 'Toronto',
		country: 'CA'
	},{
		city: 'New York City',
		country: 'US'
	},{
		city: 'Los Angeles',
		country: 'US'
	},{
		city: 'Miami',
		country: 'US'
	}];
	result: CityResult = {
		name: '',
		country: '',
		lng: '',
		lat: ''
	};
	cityWeather: CityWeather = {
		currently: {
			summary: null,
			time: null,
			icon: null,
			temperature: null,
			windSpeed: null,
			windBearing: null,
			windDirection: null,
			humidity: null
		},
		today: {
			sunrise: null,
			sunset: null
		}
	};
	isData: boolean = false;

  constructor(private store: Store<any>,
							private weather: GetWeatherService) {}

  ngOnInit() {}

	search() {
		console.log(this.cityObj)
		this.weather.getCities(this.cityObj).subscribe(result => {
			this.result = result[0];

			this.weather.getData(this.result.lat, this.result.lng).subscribe(weatherResult => {
				console.log(weatherResult)
				if (Object.keys(weatherResult).length > 0) {
					this.isData = true;
				} else {
					return;
				}

				this.cityWeather.currently.time = this.convertUnixDate(weatherResult['currently'].time, true);
				this.cityWeather.currently.summary = weatherResult['currently'].summary;
				this.cityWeather.currently.icon = weatherResult['currently'].icon;
				this.cityWeather.currently.temperature = Math.round(weatherResult['currently'].temperature);
				this.cityWeather.currently.windSpeed = Math.round(weatherResult['currently'].windSpeed);
				this.cityWeather.currently.windDirection = this.degToCompass(weatherResult['currently'].windBearing);
				this.cityWeather.currently.humidity = weatherResult['currently'].humidity * 100;
				this.cityWeather.today.sunrise = this.convertUnixDate(weatherResult['daily'].data[0].sunriseTime);
				this.cityWeather.today.sunset = this.convertUnixDate(weatherResult['daily'].data[0].sunsetTime);

			});
		});
	}

	convertUnixDate(unixTimestamp, isFullDate = false) {
		const dateFormat = 'MMM DD, YYYY',
					timeFormat = 'HH:mm';

		if (isFullDate) {
			return moment.unix(unixTimestamp).format(`${dateFormat} @ ${timeFormat}`);
		} else {
			return moment.unix(unixTimestamp).format(`${timeFormat}`);
		}
	}

	weatherIcon(icon) {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy'
			case 'cloudy':
				return 'wi wi-cloudy';
			case 'snow':
				return 'wi wi-snow';
      case 'clear-day':
        return 'wi wi-day-sunny'
      case 'partly-cloudy-night':
        return 'wi wi-night-partly-cloudy'
      default:
        return null;
    }
  }

	degToCompass(bearing) {
    const computedVal = Math.floor((bearing / 22.5) + 0.5),
					directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

    return directions[(computedVal % 16)];
	}
}
