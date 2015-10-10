import * as actions from '../actions/aggregators'
import { ADD_AGGREGATORS, UPDATE_AGGREGATORS_PRESSING } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {},
	localToRemoteMap : {
		[ADD_AGGREGATORS] : (action) => ({ event : 'aggregator:new', data : [action.entity]}),
		[UPDATE_AGGREGATORS_PRESSING] : (action) => ({ event : 'aggregator:pressing:change', data : [action.aggregatorId, action.isPressing]})
	}
}