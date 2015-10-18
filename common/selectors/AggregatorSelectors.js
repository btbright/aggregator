import { createSelector } from 'reselect'

const chatMessagesSelector = state => state.chatMessages.get('present')
const aggregatorsSelector = state => state.aggregators.get('present')
const aggregatorsListSlotsSelector = state => state.aggregatorListSlots
const pressedAggregatorSelector = state => state.user.pressedAggregatorId

//this selector handles the message->aggregator join
const joinedMessageAggregatorSelector = createSelector(
	chatMessagesSelector,
	aggregatorsSelector,
	(chatMessages, aggregators) => {
		return aggregators
		.filter(aggregator => aggregator.get('objectType') === "message")
		.filter(aggregator => !!chatMessages.find(message => message.get('id') === aggregator.get('objectId')))
		.map(aggregator => {
			var chatMessage = chatMessages.find((message) => message.get('id') === aggregator.get('objectId'));
			return aggregator.set('chatMessage', chatMessage)
		});
	});

//this selector maps aggregators to slots so they don't shift around
const mappedToSlotsSelector = createSelector(
	joinedMessageAggregatorSelector, 
	aggregatorsListSlotsSelector,
	(aggregators, slots) => {
		var packed = slots
			.map((slot) => {
				return aggregators.find(a => a.get('id') === slot.id);
			}).filter(a => !!a);
		return packed;
	});

const addPressedStateSelector = createSelector(
	mappedToSlotsSelector,
	pressedAggregatorSelector,
	(aggregators, pressedAggregatorId) => {
		if (!pressedAggregatorId) return aggregators;
		let pressedIndex = aggregators.findIndex(aggregator => aggregator.get('id') === pressedAggregatorId);
		if (pressedIndex === -1) return aggregators;
		return [
		  ...aggregators.slice(0, pressedIndex),
		  aggregators[pressedIndex].set('isPressing', true),
		  ...aggregators.slice(pressedIndex + 1)
		]
	});

const activeClickCountSelector = (state) => state.room.activeClickerCount

//this just wraps the calculations in an object
export const packagedAggregatorSelector = createSelector(
	addPressedStateSelector, activeClickCountSelector,
	(packagedAggregators, activeClickerCount) => {
		return {
			activeClickerCount,
			packagedAggregators
		}
	});