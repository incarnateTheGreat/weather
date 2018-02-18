import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

import * as constants from '../constants/constants';

@Injectable()
export class GetWeatherService {

  constructor(private http: HttpClient) {}

	getCities(cityObj) {
    const { city, country } = cityObj;

		return this.http.get(`http://localhost:8000/api/cities/${city}/${country}`);
  }

	getData(lat, lng) {
    const apiKey = '7f5d96ef59f2f0701252f9a1e26c0659',
          exclude = '?exclude=flags',
          units = '&units=ca',
          url = `https://api.darksky.net/forecast/${constants.DARKSKY_API_KEY}/${lat},${lng}${exclude}${units}`;

		return this.http.get(url);
  }
}
