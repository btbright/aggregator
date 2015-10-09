import { List } from 'immutable'

const initialState = List();
//main functionality handled in deltable
export default function aggregators(state = initialState, action) {
	switch (action.type) {
	default:
    	return state;
  	}
}