import { List, toJS, fromJS, Map } from 'immutable'
import { RUN_SIMULATIONS_AGGREGATORS, ROLL_BACK_SIMULATIONS_AGGREGATORS } from '../constants/ActionTypes'
import { scorer } from '../utils/scorer'

const initialState = Map();
//main functionality handled in deltable
export default function aggregators(state = initialState, action) {
	switch (action.type) {
	case RUN_SIMULATIONS_AGGREGATORS:
		//just pulling running aggs for now, since they are the troublemakers. Might want to simulate state changes, too
		let updates = {};
		state.forEach((aggregator,key) => {
			if (aggregator.get('state') === 'aggregating'){
				const scoreResults = scorer(aggregator.get('activePresserCount'), ((action.targetTime - action.currentTime)/1000), aggregator.get('x'), aggregator.get('velocity'), action.activeClickerCount);
				let update = {};
				if (scoreResults.x !== aggregator.get('x')){
					update.x = scoreResults.x;
				}
				if (scoreResults.velocity !== aggregator.get('velocity')){
					update.velocity = scoreResults.velocity;
				}
				if (scoreResults.x > aggregator.get('maxValue')){
					update.maxValue = scoreResults.x;
				}
				if (Object.getOwnPropertyNames(update).length > 0){
					updates[key] = update;
				}
			}
		});

		const updatedAggregators = state.withMutations(mutableAggregators => {
			Object.keys(updates).forEach(key => {
				mutableAggregators.update(key, aggregator => {
					return aggregator.merge(updates[key])
				});
			});
		});
		return updatedAggregators;
	default:
    	return state;
  	}
}