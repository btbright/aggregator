import { createSelector } from 'reselect'

const aggregatorsSelector = (state) => state.aggregators
const chatMessagesSelector = (state) => state.chatMessages

export const clicksPerMinSelector = createSelector(
	[aggregatorsSelector],
	(aggregators) => {
		var clickCutOff = Date.now() - 60000;
		var aggCutOff = Date.now() - 120000;
		return aggregators
				.filter(a => a.createdTime > aggCutOff)
				.map(a => a.clicks)
				.map(clicks => {
					return clicks.filter(click => click > clickCutOff);
				})
				.reduce((accumulator, clicks) => {
					return accumulator + clicks.length;
				},0)
	});

export const messagesPerMinSelector = createSelector(
	[chatMessagesSelector],
	(messages) => {
		var cutOff = Date.now() - 60 * 1000;
		return messages.filter(m => m.time > cutOff).length
	});