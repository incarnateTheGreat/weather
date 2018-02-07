import { Action } from '@ngrx/store';

export function citiesReducer(state: object = {}, action) {
	switch (action.type) {
		case 'STORE_CITY_DATA':
			return {data: action.data}

		default:
			return state;
	}
}
