import { createSelector } from 'reselect';

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators

function mapAggregatedMessages(chatMessages, aggregators){
	return aggregators
		.filter((aggregator) => aggregator.objectType === "message")
		.map((aggregator) => {
			var chatMessage = chatMessages.find((message) => message.id === aggregator.objectId);
			return {
				id : aggregator.id,
				level : aggregator.level,
				maxValue : aggregator.maxValue,
				clicks : aggregator.clicks,
				x : aggregator.x,
				text : chatMessage.text,
				userName : chatMessage.userName,
				time : chatMessage.time,
				hasUserNominated : chatMessage.hasUserNominated
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

const levelColors = {
	1 : "blue",
	2 : "green",
	3 : "gold"
};

function getBarLevel(x){
	if (x < 40){
		return 1;
	}
	if (x < 70){
		return 2;
	}
	return 3;
}

function mapDisplayMessages(aggregatedMessages){
	return aggregatedMessages
		.map((message) => {
			return {
				id : message.id,
				displayText : message.text,
				barColor : levelColors[getBarLevel(message.x)],
				barValue : message.x,
				rightText : new Date(message.time).toLocaleTimeString(),
				residueValue : message.maxValue,
				residueColorClass : levelColors[getBarLevel(message.maxValue)],
				leftText : message.userName
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