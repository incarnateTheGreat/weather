import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

// Components
import { AppComponent } from './app.component';

// Services
import { GetWeatherService } from './services/get-weather.service';
import { SearchCityComponent } from './components/search-city/search-city.component';

// Reducers
import { citiesReducer } from './reducers/cities.reducer';

@NgModule({
  declarations: [
    AppComponent,
    SearchCityComponent
  ],
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		StoreModule.forRoot({ cities: citiesReducer }),
		StoreDevtoolsModule.instrument({
			maxAge: 18
		})
  ],
  providers: [GetWeatherService],
  bootstrap: [AppComponent]
})
export class AppModule {}
