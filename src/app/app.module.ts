import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';

// Components
import { AppComponent } from './app.component';

// Services
import { GetWeatherService } from './services/get-weather.service';
import { SearchCityComponent } from './components/search-city/search-city.component';

// Reducers
import { simpleReducer } from './reducers/simple.reducer';

@NgModule({
  declarations: [
    AppComponent,
    SearchCityComponent
  ],
  imports: [
		BrowserModule,
		HttpModule,
		FormsModule,
		StoreModule.forRoot({ cities: simpleReducer })
  ],
  providers: [GetWeatherService],
  bootstrap: [AppComponent]
})
export class AppModule {}
