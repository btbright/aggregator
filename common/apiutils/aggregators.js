import * as actions from '../actions/aggregators'
import { NOMINATE_AGGREGATORS, UPDATE_AGGREGATOR_SELECT_DESELECT } from '../constants/ActionTypes'

export default {
	remoteToLocalMap : {
		'12' : actions.handlePackedUpdates
	},
	localToRemoteMap : {
		[NOMINATE_AGGREGATORS] : (action) => ({ event : 'aggregator:nominate', data : [action.entity]}),
		[UPDATE_AGGREGATOR_SELECT_DESELECT] : (action) => ({ event : 'aggregator:pressing:change', data : [action.id, action.isSelected]})
	}
} 