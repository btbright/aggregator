import { createSelector } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators
const aggregatorsListSlotsSelector = (state) => state.aggregatorListSlots

function joinWithMessages(chatMessages, aggregators){
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
				isComplete : aggregator.isComplete,
				isRetired : aggregator.isRetired
			}
		})
}

//this selector handles the message->aggregator join
export const aggregatedMessagesSelector = createSelector(
	[chatMessagesSelector,aggregatorsSelector, aggregatorsListSlotsSelector],
	(chatMessages, aggregators, slots) => {
		return {
			slots : slots,
			aggregatedMessages : joinWithMessages(chatMessages, aggregators)
		}
	});

function mapAggregatorsToSlots(aggregators, slots){
	return slots
			.map((slot) => {
				var aggregator = aggregators.find(a => a.id === slot.id);
				return aggregator;
			});
}

function mapDisplayMessages(aggregatedMessages){
	return aggregatedMessages
		.map((message) => {
			return {
				id : message.id,
				displayText : message.text,
				barColor : levelColors[getLevel(message.maxValue)],
				barValue : message.x,
				rightText : new Date(message.time).toLocaleTimeString(),
				residueValue : message.maxValue,
				residueColorClass : levelColors[getLevel(message.maxValue)],
				leftText : message.userName,
				isComplete : message.isComplete,
				isRetired : message.isRetired
			}
		});
}


//this selector does the calculations to prepare the aggregator for display
export const aggregatedMessagesDisplaySelector = createSelector(
	[aggregatedMessagesSelector, aggregatorsListSlotsSelector],
	(state, slots) => {
		return {
			displayReadyAggregatedMessages : mapAggregatorsToSlots(mapDisplayMessages(state.aggregatedMessages),slots)
		}
	});