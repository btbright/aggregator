import { createSelector } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators

function mapAggregatedMessages(chatMessages, aggregators){
	return aggregators
		.filter((aggregator) => aggregator.objectType === "message")
		.map((aggregator) => {
			var chatMessage = chatMessages.find((message) => message.id === aggregator.objectId);
			return {
				id : aggregator.id,
				maxValue : aggregator.maxValue,
				clicks : aggregator.clicks,
				x : aggregator.x,
				text : chatMessage.text,
				userName : chatMessage.userName,
				time : chatMessage.time,
				hasUserNominated : chatMessage.hasUserNominated,
				isComplete : aggregator.isComplete
			}
		})
}

//this selector handles the message->aggregator join
export const aggregatedMessagesSelector = createSelector(
	[chatMessagesSelector,aggregatorsSelector],
	(chatMessages, aggregators) => {
		return {
			aggregatedMessages : mapAggregatedMessages(chatMessages, aggregators)
		}
	});


function mapDisplayMessages(aggregatedMessages){
	return aggregatedMessages
		.map((message) => {
			return {
				id : message.id,
				displayText : message.text,
				barColor : levelColors[getLevel(message.x)],
				barValue : message.x,
				rightText : new Date(message.time).toLocaleTimeString(),
				residueValue : message.maxValue,
				residueColorClass : levelColors[getLevel(message.maxValue)],
				leftText : message.userName,
				isComplete : message.isComplete
			}
		});
}


//this selector does the calculations to prepare the aggregator for display
export const aggregatedMessagesDisplaySelector = createSelector(
	[aggregatedMessagesSelector],
	(state) => {
		return {
			displayReadyAggregatedMessages : mapDisplayMessages(state.aggregatedMessages)
		}
	});