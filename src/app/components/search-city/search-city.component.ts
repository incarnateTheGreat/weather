import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search-city',
  templateUrl: './search-city.component.html',
  styleUrls: ['./search-city.component.css']
})
export class SearchCityComponent implements OnInit {
	city: string = '';

  constructor(private store: Store<any>) {}

  ngOnInit() {
		// this.store.dispatch({type: 'STORE_CITY_DATA'});
	}

	search() {
		// this.weather.getCityData().subscribe(result => {
		// 	console.log(result)
		// });
		// this.store.select('cities').subscribe((data: any) => {
		// 	console.log(data)
		// });
		console.log(this.store.select('cities'))
	}
}
