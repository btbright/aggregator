import { createSelector } from 'reselect'
import { levelColors, getLevel } from '../utils/levels'

const chatMessagesSelector = (state) => state.chatMessages
const aggregatorsSelector = (state) => state.aggregators
const aggregatorsListSlotsSelector = (state) => state.aggregatorListSlots

//this selector handles the message->aggregator join
const joinedMessageAggregatorSelector = createSelector(
	chatMessagesSelector,
	aggregatorsSelector,
	(chatMessages, aggregators) => {
		return aggregators
		.filter((aggregator) => aggregator.objectType === "message")
		.filter(aggregator => !!chatMessages.find(message => message.id === aggregator.objectId))
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
				isRetired : aggregator.isRetired,
				completedTime : aggregator.completedTime,
				velocity : aggregator.velocity
			}
		});
	});


//this selector does the calculations to transform the raw aggregator for display
const preparedForDisplaySelector = createSelector(
	joinedMessageAggregatorSelector,
	(joinedAggregators) => {
		return joinedAggregators.map((message) => {
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
				isRetired : message.isRetired,
				completedTime : message.completedTime,
				clicks : message.clicks,
				velocity : message.velocity
			}
		});
	});

//this selector maps aggregators to slots so they don't shift around
const mappedToSlotsSelector = createSelector(
	preparedForDisplaySelector, 
	aggregatorsListSlotsSelector,
	(aggregators, slots) => {
		return slots
			.map((slot) => {
				var aggregator = aggregators.find(a => a.id === slot.id);
				return aggregator;
			});
	});

const activeAggregatorSelector = aggregators => aggregators.filter(a => !a.isRetired)

const activeClickCountSelector = (state) => state.room.activeClickerCount

//this just wraps the calculations in an object
export const packagedAggregatorSelector = createSelector(
	mappedToSlotsSelector, activeClickCountSelector,
	(packagedAggregators, activeClickerCount) => {
		return {
			activeClickerCount,
			packagedAggregators,
			activeAggregators : activeAggregatorSelector(packagedAggregators)
		}
	});