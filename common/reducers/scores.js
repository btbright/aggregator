import { List, Map } from 'immutable'
import { UPDATE_USER_POINTS, REMOVE_USER_POINTS } from '../constants/ActionTypes';

const initialState = List()

export default function scores(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_POINTS:
		const findResults = state.findEntry(obj => obj.get('userName') === action.userName);
		if (!findResults){
			return state.push(Map({ userName : action.userName, points : action.points })).sortBy(s => s.get('points')).reverse();
		}
		const [index, userScore] = findResults;
		return state.set(index, userScore.set('points',action.points)).sortBy(s => s.get('points')).reverse();
	case REMOVE_USER_POINTS:
		const findResultsRemove = state.findEntry(obj => obj.get('userName') === action.userName);
		if (!findResultsRemove){
			return state;
		}
		const [indexRemove, userScoreRemove] = findResultsRemove;
		return state.delete(indexRemove).sortBy(s => s.get('points')).reverse();
	default:
		return state;
	}
}