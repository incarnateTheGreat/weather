import { Component, OnInit } from '@angular/core';

// import { GetWeatherService } from '../../services/get-weather.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

interface CityState {
	cities: object;
}

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit {
	city: string = '';

  constructor(private store: Store<CityState>) {
		this.city = this.store.select('cities');
	}

	//private weather: GetWeatherService

  ngOnInit() {
		this.store.dispatch({type: 'STORE_CITY_DATA'});
	}

	search() {
		// this.weather.getCityData().subscribe(result => {
		// 	console.log(result)
		// });
	}
}
