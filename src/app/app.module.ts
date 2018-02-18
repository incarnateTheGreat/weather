import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingModule } from 'ngx-loading';
import { D3Service } from 'd3-ng2-service';

// Components
import { AppComponent } from './app.component';
import { SearchCityComponent } from './components/search-city/search-city.component';
import { WeatherChartComponent } from './components/weather-chart/weather-chart.component';

// Services
import { GetWeatherService } from './services/get-weather.service';

// Reducers
import { citiesReducer } from './reducers/cities.reducer';

@NgModule({
  declarations: [
    AppComponent,
    SearchCityComponent,
    WeatherChartComponent
  ],
  imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		StoreModule.forRoot({ cities: citiesReducer }),
		StoreDevtoolsModule.instrument({
			maxAge: 18
		}),
    LoadingModule
  ],
  providers: [
    GetWeatherService,
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
