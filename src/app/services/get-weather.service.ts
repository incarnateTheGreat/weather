import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class GetWeatherService {

  constructor(private http: HttpClient) {}

	getCities(city, country) {
		return this.http.get(`http://localhost:8000/api/cities/${city}/${country}`);
  }

	getData(lat, lng) {
    const url = `https://api.darksky.net/forecast/7f5d96ef59f2f0701252f9a1e26c0659/${lat},${lng}`;

		return this.http.get(url);
  }
}
