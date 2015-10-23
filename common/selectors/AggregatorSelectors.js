import { createSelector } from 'reselect'

const chatMessagesSelector = state => state.chatMessages.get('present')
const aggregatorsSelector = state => state.aggregators.get('present')
const aggregatorsListSlotsSelector = state => state.aggregatorListSlots.get('present')
const pressedAggregatorSelector = state => state.user.pressedAggregatorId

//this selector maps aggregators to slots so they don't shift around
const mappedToSlotsSelector = createSelector(
	aggregatorsSelector, 
	aggregatorsListSlotsSelector,
	chatMessagesSelector,
	(aggregators, slots, chatMessages) => {
		var packed = slots
			.map((slot) => {
				const chatMessage = chatMessages.find((message) => message.get('id') === slot.get('objectId'));
				const aggregator = aggregators.find(a => a.get('id') === slot.get('id'));
				if (aggregator){
					return aggregator.set('chatMessage', chatMessage);
				}
				return;
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
		return aggregators.update(pressedIndex, aggregator => aggregator.set('isPressing', true))
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