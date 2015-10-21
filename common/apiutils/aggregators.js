import * as actions from '../actions/aggregators'
import { ADD_AGGREGATORS, UPDATE_AGGREGATOR_SELECT_DESELECT } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		//we get this error when an aggregator already exists, so change it to support
		//for the real one
		'error:aggregator:new' : (erroredId, realId) => {
			return [
				actions.addAggregatorError(erroredId),
				actions.selectDeselectAggregator(realId)
			]
		},
		'12' : actions.handlePackedUpdates
	},
	localToRemoteMap : {
		[ADD_AGGREGATORS] : (action) => ({ event : 'aggregator:new', data : [action.entity]}),
		[UPDATE_AGGREGATOR_SELECT_DESELECT] : (action) => ({ event : 'aggregator:pressing:change', data : [action.id, action.isSelected]})
	}
}