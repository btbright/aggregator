import { UPDATE_USER_NAME, REMOVE_USER_NAME, UPDATE_FILTER_LEVEL, UPDATE_AGGREGATOR_SELECT_DESELECT } from '../constants/ActionTypes';

const initialState = {
	userName : "",
	filterLevel : "",
	pressedAggregatorId : ""
}

export default function user(state = initialState, action) {
	switch (action.type) {
	case UPDATE_USER_NAME:
		return Object.assign({},state,{
			userName : action.userName
		});
	case REMOVE_USER_NAME:
		return Object.assign({},state,{
			userName : ""
		});
	case UPDATE_FILTER_LEVEL:
		return Object.assign({},state,{
			filterLevel : action.filterLevel
		});
	case UPDATE_AGGREGATOR_SELECT_DESELECT:
		if (!action.isSelected){
			return Object.assign({},state,{
				pressedAggregatorId : ""
			});
		}
		return Object.assign({},state,{
			pressedAggregatorId : state.pressedAggregatorId === action.id ? "" : action.id
		});

	default:
		return state;
	}
}