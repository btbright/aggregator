import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'
import _ from 'lodash';
import { toJS } from 'immutable'

const chatMessagesSelector = (state) => state.chatMessages.get('present')
const aggregatorsSelector = (state) => state.aggregators.get('present')
const userSelectorSelector = (state) => state.user


const chatRelevantAggregatorDataSelector = createSelector(
	aggregatorsSelector,
	(aggregators) => {
		return aggregators.filter(aggregator => aggregator.get('objectType') === 'message');
	});

//this selector handles the message->aggregator join
export const chatMessagesWithAggregationInfoSelector = createSelector(
	[chatMessagesSelector, userSelectorSelector, chatRelevantAggregatorDataSelector],
	(chatMessages, user, aggregators) => {
		return {
			chatMessages : chatMessages,
			aggregators : aggregators,
			user
		}
	});

