import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Observer } from 'rxjs/Rx';
import * as moment from 'moment';
import * as constants from '../../constants/constants';
import { GetWeatherService } from '../../services/get-weather.service';

interface CityResult {
	name: string,
	country: string,
	lng: string,
	lat: string
}

interface CityWeather {
	today?: {
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
	cities: Object[] = constants.CITIES_ARRAY;
	result: CityResult = {
		name: '',
		country: '',
		lng: '',
		lat: ''
	};
	cityWeather: CityWeather = {
		today: {
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
	longTermForecast: any[];
	timer: Observable<any>;
	updateInterval: any = null;
	loading: boolean = false;
	dateString: string = 'MMM DD, YYYY';
	timeString: string = 'HH:mm';

	private chartData: Array<any>;

  constructor(private store: Store<any>,
							private weather: GetWeatherService) {}

  ngOnInit() {}

	activateInterval() {
	  this.timer = Observable.timer(0, 60000 * 5);

		// Updates the Weather Data automatically every five minutes.
	  this.updateInterval = this.timer.subscribe(x => {
	    this.search();
	  });
	}

	deactivateInterval() {
		this.updateInterval.unsubscribe();
	}

	fireSearch() {
		if (this.updateInterval) {
			this.deactivateInterval();
			this.activateInterval();
		} else {
			this.activateInterval();
		}
	}

	search() {
		this.loading = true;

		setTimeout(() => {
			this.weather.getCities(this.cityObj).subscribe(
				(result) => { this.result = result[0] },
				(err) => { console.log(err) },
				() => { this.getWeatherData(); }
			);
		}, 0);
	}

	getWeatherData() {
		this.weather.getData(this.result.lat, this.result.lng).subscribe(weatherResult => {
			if (Object.keys(weatherResult).length > 0) {
				this.loading = false;
				this.isData = true;
			} else {
				return;
			}

			const today = weatherResult['currently'],
						tomorrow = weatherResult['daily']['data'][1],
						dailyChartData = weatherResult['daily']['data'];

			this.chartData = [];

			// Determine length of remaining days for Long Term Forecast.
			this.longTermForecast = weatherResult['daily']['data'].slice(2, weatherResult['daily']['data'].length);

			// Today/Current
			this.cityWeather.today.time = this.convertUnixDate(today.time, `${this.dateString} @ ${this.timeString}`);
			this.cityWeather.today.summary = today.summary;
			this.cityWeather.today.icon = today.icon;
			this.cityWeather.today.temperature = this.roundFigures(today.temperature);
			this.cityWeather.today.windSpeed = this.roundFigures(today.windSpeed);
			this.cityWeather.today.windDirection = this.degToCompass(today.windBearing);
			this.cityWeather.today.humidity = this.roundFigures(today.humidity * 100);
			this.cityWeather.today.sunriseSunset.sunrise = this.convertUnixDate(weatherResult['daily'].data[0].sunriseTime, this.timeString);
			this.cityWeather.today.sunriseSunset.sunset = this.convertUnixDate(weatherResult['daily'].data[0].sunsetTime, this.timeString);

			// Tomorrow
			this.cityWeather.tomorrow.summary = tomorrow.summary;
			this.cityWeather.tomorrow.icon = tomorrow.icon;
			this.cityWeather.tomorrow.temperature = this.roundFigures(tomorrow.temperatureHigh);
			this.cityWeather.tomorrow.windSpeed = this.roundFigures(tomorrow.windSpeed);
			this.cityWeather.tomorrow.windDirection = this.degToCompass(today.windBearing);
			this.cityWeather.tomorrow.humidity = this.roundFigures(tomorrow.humidity * 100);
			this.cityWeather.tomorrow.sunriseSunset.sunrise = this.convertUnixDate(weatherResult['daily'].data[1].sunriseTime, this.timeString);
			this.cityWeather.tomorrow.sunriseSunset.sunset = this.convertUnixDate(weatherResult['daily'].data[1].sunsetTime, this.timeString);

			// Hourly Chart Data
			for (let x in this.longTermForecast) {
				this.chartData.push({
					time: this.longTermForecast[x].time,
					temperature: this.roundFigures(this.longTermForecast[x].temperatureHigh)
				})
			}
		});
	}

	roundFigures(num) {
		return Math.round(num);
	}

	convertUnixDate(unixTimestamp, format = this.dateString) {
		return moment.unix(unixTimestamp).format(format);
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
			case 'rain':
				return 'wi wi-rain';
			case 'wind':
				return 'wi wi-day-windy';
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
