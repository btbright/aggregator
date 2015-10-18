import { createSelector } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'

const chatMessagesSelector = (state) => state.chatMessages.get('present')
const userSelectorSelector = (state) => state.user


//this selector handles the message->aggregator join
export const chatMessagesWithAggregationInfoSelector = createSelector(
	[chatMessagesSelector, userSelectorSelector],
	(chatMessages, user) => {
		return {
			chatMessages : chatMessages.sortBy(cm => cm.get('time')),
			user
		}
	});

