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
		sunriseSunset?: {
			sunrise?: any,
			sunset?: any
		}
	},
	tomorrow?: {
		summary?: string,
		icon?: string,
		temperature?: number,
		windSpeed?: number,
		windBearing?: number,
		windDirection?: string,
		humidity?: number,
		sunriseSunset?: {
			sunrise?: any,
			sunset?: any
		}
	}
}

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.scss']
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
			humidity: null,
			sunriseSunset: {
				sunrise: null,
				sunset: null
			}
		},
		tomorrow: {
			summary: null,
			icon: null,
			temperature: null,
			windSpeed: null,
			windBearing: null,
			windDirection: null,
			humidity: null,
			sunriseSunset: {
				sunrise: null,
				sunset: null
			}
		}
	};
	isData: boolean = false;

  constructor(private store: Store<any>,
							private weather: GetWeatherService) {}

  ngOnInit() {}

	search() {
		this.weather.getCities(this.cityObj).subscribe(result => {
			this.result = result[0];

			this.weather.getData(this.result.lat, this.result.lng).subscribe(weatherResult => {
				if (Object.keys(weatherResult).length > 0) {
					this.isData = true;
				} else {
					return;
				}

				const today = weatherResult['currently'],
							tomorrow = weatherResult['daily']['data'][1];

				this.cityWeather.currently.time = this.convertUnixDate(today.time, true);
				this.cityWeather.currently.summary = today.summary;
				this.cityWeather.currently.icon = today.icon;
				this.cityWeather.currently.temperature = Math.round(today.temperature);
				this.cityWeather.currently.windSpeed = Math.round(today.windSpeed);
				this.cityWeather.currently.windDirection = this.degToCompass(today.windBearing);
				this.cityWeather.currently.humidity = today.humidity * 100;
				this.cityWeather.currently.sunriseSunset.sunrise = this.convertUnixDate(weatherResult['daily'].data[0].sunriseTime);
				this.cityWeather.currently.sunriseSunset.sunset = this.convertUnixDate(weatherResult['daily'].data[0].sunsetTime);

				console.log(weatherResult['daily']['data'][1])

				this.cityWeather.tomorrow.summary = tomorrow.summary;
				this.cityWeather.tomorrow.icon = tomorrow.icon;
				this.cityWeather.tomorrow.temperature = Math.round(tomorrow.temperatureHigh);
				this.cityWeather.tomorrow.windSpeed = Math.round(tomorrow.windSpeed);
				this.cityWeather.tomorrow.windDirection = this.degToCompass(today.windBearing);
				this.cityWeather.tomorrow.humidity = tomorrow.humidity * 100;
				this.cityWeather.tomorrow.sunriseSunset.sunrise = this.convertUnixDate(weatherResult['daily'].data[1].sunriseTime);
				this.cityWeather.tomorrow.sunriseSunset.sunset = this.convertUnixDate(weatherResult['daily'].data[1].sunsetTime);

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
			case 'clear-night':
				return 'wi wi-night-clear';
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy'
			case 'cloudy':
				return 'wi wi-cloudy';
			case 'fog':
				return 'wi wi-fog';
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
