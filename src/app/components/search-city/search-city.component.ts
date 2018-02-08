import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { GetWeatherService } from '../../services/get-weather.service';

interface CityResult {
	name: string,
	country: string,
	lng: string,
	lat: string
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

  constructor(private store: Store<any>,
							private weather: GetWeatherService) {}

  ngOnInit() {}

	search() {
		// this.store.select('cities').subscribe((data: any) => {
		// 	console.log(data)
		// });

		this.weather.getCities(this.city, this.country).subscribe(result => {
			this.result = result[0];
		});
	}
}
