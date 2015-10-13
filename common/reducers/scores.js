import { List, toJS, fromJS, Map } from 'immutable'
import { UPDATE_USER_POINTS } from '../constants/ActionTypes';

const initialState = List()

export default function user(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_POINTS:
		const findResults = state.findEntry(obj => obj.get('userName') === action.userName);
		if (!findResults){
			return state.push(Map({ userName : action.userName, points : action.points })).sortBy(s => s.points)
		}
		const [index, userScore] = findResults;
		return state.set(index, userScore.set('points',action.points)).sortBy(s => s.points);
	default:
		return state;
	}
}