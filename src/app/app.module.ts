import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingModule } from 'ngx-loading';

// Components
import { AppComponent } from './app.component';

// Services
import { GetWeatherService } from './services/get-weather.service';
import { SearchCityComponent } from './components/search-city/search-city.component';

// Reducers
import { citiesReducer } from './reducers/cities.reducer';

// Interceptor
import { InterceptorModule } from './interceptor.module';

@NgModule({
  declarations: [
    AppComponent,
    SearchCityComponent
  ],
  imports: [
		BrowserModule,
		HttpClientModule,
    InterceptorModule,
		FormsModule,
		StoreModule.forRoot({ cities: citiesReducer }),
		StoreDevtoolsModule.instrument({
			maxAge: 18
		}),
    LoadingModule
  ],
  providers: [GetWeatherService],
  bootstrap: [AppComponent]
})
export class AppModule {}
