import { Action } from '@ngrx/store';

export function simpleReducer(state: object = {}, action) {
	switch (action.type) {
		case 'STORE_CITY_DATA':
			return {data: action.data}

		default:
			return state;
	}
}
