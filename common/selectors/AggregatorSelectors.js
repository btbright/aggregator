import { createSelector } from 'reselect'

const chatMessagesSelector = state => state.chatMessages.get('present')
const aggregatorsSelector = state => state.aggregators.get('present')
const aggregatorsListSlotsSelector = state => state.aggregatorListSlots.get('present')
const pressedAggregatorSelector = state => state.user.pressedAggregatorId
const basePermagatorSelector = state => state.room.permagators
const userSelector = state => state.user
 
//this selector maps aggregators to slots so they don't shift around
const mappedToSlotsSelector = createSelector(
	aggregatorsSelector, 
	aggregatorsListSlotsSelector,
	chatMessagesSelector,
	(aggregators, slots, chatMessages) => {
		var packed = slots
			.map((slot) => {
				const chatMessage = chatMessages.get(slot.get('objectId'));
				const aggregator = aggregators.get(slot.get('id'));
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

const detailedPressedSelector = createSelector(
	userSelector,
	user => {
		return {
			pressedAggregatorId : user.pressedAggregatorId,
			pressedObjectId : user.pressedObjectId,
			pressedObjectType : user.pressedObjectType
		}
	})

const permagatorSelector = createSelector(
	basePermagatorSelector,
	aggregatorsSelector,
	detailedPressedSelector,
	(permagators, aggregators, pressedAggregatorData) => {
		if (!permagators) return;
		return permagators.map(permagator => {
			const matched = aggregators.find(aggregator => aggregator.get('objectId') === permagator.id && aggregator.get('state') !== 'removed');
			if (matched){
				console.log(matched.get('objectId'), pressedAggregatorData)
				return Object.assign({},permagator,{
					aggregator : matched.toJS(),
					isPressing : matched.get('objectId') === pressedAggregatorData.pressedObjectId
				})
			}
			return permagator;
		})
	})
 
const activeClickCountSelector = (state) => state.room.activeClickerCount;
const roomNameSelector = (state) => state.room.name;

//this just wraps the calculations in an object
export const packagedAggregatorSelector = createSelector(
	addPressedStateSelector, activeClickCountSelector, permagatorSelector, roomNameSelector,
	(packagedAggregators, activeClickerCount, permagators, roomName) => {
		return {
			activeClickerCount,
			packagedAggregators,
			permagators,
			roomName
		}
	});