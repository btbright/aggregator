import { createSelector } from 'reselect'

const chatMessagesSelector = state => state.chatMessages.get('present')
const aggregatorsSelector = state => state.aggregators.get('present')
const aggregatorsListSlotsSelector = state => state.aggregatorListSlots

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

const activeClickCountSelector = (state) => state.room.activeClickerCount

//this just wraps the calculations in an object
export const packagedAggregatorSelector = createSelector(
	mappedToSlotsSelector, activeClickCountSelector,
	(packagedAggregators, activeClickerCount) => {
		return {
			activeClickerCount,
			packagedAggregators
		}
	});