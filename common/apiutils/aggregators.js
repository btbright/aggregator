import * as actions from '../actions/aggregators'
import { ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'aggregator:new' : actions.addAggregator,
		'aggregators:update' : actions.makeUpdateAggregatorsAction,
		'aggregator:click:new' : (id, click) => actions.addClickToAggregator(id, Date.now())
	},
	localToRemoteMap : {
		[ADD_AGGREGATORS] : (action) => ({ event : 'aggregator:new', data : [action.aggregator]}),
		[UPDATE_AGGREGATORS_PRESSING] : (action) => ({ event : 'aggregator:pressing:change', data : [action.aggregatorId, action.isPressing]})
	}
}