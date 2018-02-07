import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { GetWeatherService } from './services/get-weather.service';

interface CityState {
	cities: object;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private store: Store<CityState>,
							private weather: GetWeatherService) {}

	ngOnInit() {
		this.weather.getCities().subscribe(result => {
			this.store.dispatch({
				type: 'STORE_USER_DATA',
				data: result
			});
		});
	}
}
