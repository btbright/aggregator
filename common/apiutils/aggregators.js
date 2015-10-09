import * as actions from '../actions/aggregators'
import { ADD_AGGREGATOR, ADD_CLICK_TO_AGGREGATOR } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'aggregator:new' : actions.addAggregator,
		'aggregators:update' : actions.makeUpdateAggregatorsAction,
		'aggregator:click:new' : (id, click) => actions.addClickToAggregator(id, Date.now())
	},
	localToRemoteMap : {
		[ADD_AGGREGATOR] : (action) => ({ event : 'aggregator:new', data : [action.aggregator]}),
		[ADD_CLICK_TO_AGGREGATOR] : (action) => ({ event : 'aggregator:click:new', data : [action.aggregatorId, action.click]})
	}
}