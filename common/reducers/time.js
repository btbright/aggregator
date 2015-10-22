import { Map } from 'immutable'
import { MOVE_TO_TIME, CORRECT_TIME, PAUSE_TIME, PLAY_TIME, REVERSE_TIME } from '../constants/ActionTypes'

const initialState = Map({
	currentTime : 0,
	timeCompensation : 0,
	averageLatency : 0,
	isPaused : false,
	isReversed : false
});

export default function time(state = initialState, action) {
	switch (action.type) {
	case MOVE_TO_TIME:
		return state.set('currentTime',action.time);
	case CORRECT_TIME:
		let newClientTime = Date.now();
		let latency = (newClientTime - action.originalClientTime)/2; //roundtrip / 2
		let newAverageLatency = state.get('averageLatency') === 0 ? latency : (state.get('averageLatency') + latency)/2; //moving average
		let serverDelta = action.serverTime - (newClientTime-latency);
		return state.merge(Map({ timeCompensation : parseInt(serverDelta - newAverageLatency,10), averageLatency : newAverageLatency }));
	case PAUSE_TIME:
		return state.set('isPaused',true);
	case PLAY_TIME:
		return state.set('isPaused',false).set('isReversed', false);
	case REVERSE_TIME:
		return state.set('isReversed',true).set('isPaused', false);;
	default:
    	return state;
  	}
}