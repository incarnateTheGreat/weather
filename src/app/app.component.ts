import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

interface CityState {
	cities: object;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private store: Store<any>) {}

	ngOnInit() {
		// this.weather.getCities().subscribe(result => {
		// 	this.store.dispatch({
		// 		type: 'STORE_USER_DATA',
		// 		data: result
		// 	});
		// });
	}
}
