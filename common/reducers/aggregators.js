import { List, toJS, fromJS, Map } from 'immutable'
import { RUN_SIMULATIONS_AGGREGATORS, ROLL_BACK_SIMULATIONS_AGGREGATORS } from '../constants/ActionTypes'
import { scorer } from '../utils/scorer'

const initialState = List();
//main functionality handled in deltable
export default function aggregators(state = initialState, action) {
	switch (action.type) {
	//we get the full state from the 'scrubbable' store here
	case RUN_SIMULATIONS_AGGREGATORS:
		//just pulling running aggs for now, since they are the troublemakers. Might want to simulate state changes, too
		let simulations = {};
		const updatedAggregators = state.get('present').withMutations(mutableAggregators => {
			mutableAggregators.forEach(aggregator => {
				if (aggregator.get('state') === 'aggregating'){
					const scoreResults = scorer(aggregator.get('activePresserCount'), ((action.targetTime - action.currentTime)/1000), aggregator.get('x'), aggregator.get('velocity'), action.activeClickerCount);
					const aggregatorSimulations = []
					if (scoreResults.x !== aggregator.get('x')){
						aggregator.set('x',scoreResults.x);
						aggregatorSimulations.push({
							id : aggregator.get('id'),
							property : 'x',
							change : scoreResults.x - aggregator.get('x')
						})
					}
					if (scoreResults.velocity !== aggregator.get('velocity')){
						aggregator.set('velocity',scoreResults.velocity);
						aggregatorSimulations.push({
							id : aggregator.get('id'),
							property : 'velocity',
							change : scoreResults.velocity - aggregator.get('velocity')
						})
					}
					if (scoreResults.x > aggregator.get('maxValue')){
						aggregator.set('maxValue',scoreResults.x);
						aggregatorSimulations.push({
							id : aggregator.get('id'),
							property : 'maxValue',
							change : scoreResults.x - aggregator.get('maxValue')
						})
					}
					simulations[aggregator.get('id')] = aggregatorSimulations;
				}
			});
		});
		var savedSimulations = state.set('simulations',state.get('simulations').mergeWith((prev, next) => {
			return prev.concat(next);
		}, fromJS(simulations)));
		return savedSimulations.set('present',updatedAggregators);
		
	case ROLL_BACK_SIMULATIONS_AGGREGATORS:
		const oldSimulations = state.get('simulations').toJS();
		if (!oldSimulations) return state;
		let updatedPresent = state.get('present');
		Object.keys(oldSimulations).forEach(aggregatorId => {
			const findResults = state.get('present').findEntry(a => a.get('id') === aggregatorId);
			if (findResults){
				const [index, aggregator] = findResults;
				const updatedAggregator = aggregator.withMutations(mutableAggregator => {
					oldSimulations[aggregatorId].forEach(simulation => {
						mutableAggregator.set(simulation.property, mutableAggregator.get(simulation.property) - simulation.change);
					});
				});
				updatedPresent = updatedPresent.setIn(['present',index], updatedAggregator);
			}
		});
		return state.withMutations(mutableState => {
			mutableState.set('simulations', Map());
			mutableState.set('present', updatedPresent)
		});
	default:
    	return state;
  	}
}