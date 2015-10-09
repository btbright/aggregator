import { Map } from 'immutable'
import { UPDATE_TIME } from '../constants/ActionTypes'

const initialState = Map({
	currentTime : 0
});

export default function time(state = initialState, action) {
	switch (action.type) {
	case UPDATE_TIME:
		return state.set('currentTime',action.time);
	default:
    	return state;
  	}
}