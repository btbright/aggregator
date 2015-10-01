import { createSelector } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators
const userSelectorSelector = (state) => state.user

function mapAggregatedMessages(chatMessages, aggregators){
	return chatMessages
		.map((message) => {
			var aggregator = aggregators.find((aggregator) => message.id === aggregator.objectId);
			var newMessage = {
				id : message.id,
				text : message.text,
				userName : message.userName,
				time : message.time,
				aggregationLevel : '',
				isComplete : false,
				aggregatorId : 0
			};
			if (aggregator){
				newMessage.aggregatorId = aggregator.id;
				newMessage.aggregationLevel = levelColors[getLevel(aggregator.maxValue)];
				newMessage.isComplete = aggregator.isComplete;
			}
			return newMessage;
		})
}


//this selector handles the message->aggregator join
export const chatMessagesWithAggregationInfoSelector = createSelector(
	[chatMessagesSelector,aggregatorsSelector,userSelectorSelector],
	(chatMessages, aggregators, user) => {
		return {
			messagesWithAggregationInfo : mapAggregatedMessages(chatMessages, aggregators),
			user
		}
	});