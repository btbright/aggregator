import * as actions from '../actions/aggregators'
import { ADD_AGGREGATORS, UPDATE_AGGREGATOR_SELECT_DESELECT } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {},
	localToRemoteMap : {
		[ADD_AGGREGATORS] : (action) => ({ event : 'aggregator:new', data : [action.entity]}),
		[UPDATE_AGGREGATOR_SELECT_DESELECT] : (action) => ({ event : 'aggregator:pressing:change', data : [action.id, action.isSelected]})
	}
}