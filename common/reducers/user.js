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
		if (state.pressedAggregatorId === action.id || state.pressedObjectId === action.objectId){
			return Object.assign({},state,{
				pressedAggregatorId : "",
				pressedObjectType : "",
				pressedObjectId : ""
			});
		}
		return Object.assign({},state,{
			pressedAggregatorId : action.id,
			pressedObjectType : action.objectType, //this is a hack to get around the few times we don't have the aggregator id, even
			pressedObjectId : action.objectId      //though it exists on the server
		});

	default:
		return state;
	}
}