import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'
import _ from 'lodash';
import { toJS } from 'immutable'

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators
const userSelectorSelector = (state) => state.user


const chatRelevantAggregatorDataSelector = createSelector(
	aggregatorsSelector,
	(aggregators) => {
		return aggregators
		.filter(aggregator => aggregator.objectType === 'message')
		.map(aggregator => {
			return {
				aggregatorId : aggregator.id,
				aggregationLevel : levelColors[getLevel(aggregator.maxValue)],
				isComplete : aggregator.isComplete,
				messageId : aggregator.objectId
			}
		})
	});

//this selector handles the message->aggregator join
export const chatMessagesWithAggregationInfoSelector = createSelector(
	[chatMessagesSelector, userSelectorSelector],
	(chatMessages, user) => {
		return {
			chatMessages : chatMessages.get('present'),
			aggregatorData : false,
			user
		}
	});

