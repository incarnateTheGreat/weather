import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import * as constants from './constants/constants';
import 'rxjs/add/operator/map';

@Injectable()
export class GetWeatherService {

	_cities: any;

  constructor(private http: Http) {}

	getCities() {
		this.http.get('data/cities.json')
			.map(res => this._cities = res.json());
  }

	getData() {
		return this.http.get('data/cities.json')
			.map(res => res.json());

		// const url = `https://api.darksky.net/forecast/${}/37.8267,-122.4233`;
		//
		// return this.http.get(url)
		// 	.map(res => res.json());
  }

}
