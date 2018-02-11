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
		time?: any,
		temperature?: number
	}
}

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit {
	city: string = 'Toronto';
	country: string = '';
	countries: string[] = ['CA', 'US'];
	result: CityResult = {
		name: '',
		country: '',
		lng: '',
		lat: ''
	};
	cityWeather: CityWeather = {
		currently: {
			time: null,
			temperature: null
		}
	};
	isData: boolean = false;

  constructor(private store: Store<any>,
							private weather: GetWeatherService) {}

  ngOnInit() {}

	search() {
		this.weather.getCities(this.city, this.country).subscribe(result => {
			this.result = result[0];

			this.weather.getData(this.result.lat, this.result.lng).subscribe(result => {
				this.cityWeather = result;
				this.isData = true;

				this.cityWeather.currently.time = moment.unix(this.cityWeather.currently.time).format("MM/DD/YYYY @ HH:mm");
				this.cityWeather.currently.temperature = Math.round(this.cityWeather.currently.temperature);

				console.log(this.cityWeather)

			});
		});
	}

	weatherIcon(icon) {
    switch (icon) {
      case 'partly-cloudy-day':
        return 'wi wi-day-cloudy'
			case 'cloudy':
				return 'wi wi-cloudy';
      case 'clear-day':
        return 'wi wi-day-sunny'
      case 'partly-cloudy-night':
        return 'wi wi-night-partly-cloudy'
      default:
        return null;
    }
  }
}
