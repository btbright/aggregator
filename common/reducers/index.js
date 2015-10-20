import { combineReducers } from 'redux';
import scrubbableReducerFactory from '../reducerEnhancers/scrubbableReducerFactory';
import chatMessages from './chat';
import aggregators from './aggregators';
import aggregatorListSlots from './aggregatorListSlots';
import room from './room';
import user from './user';
import notifications from './notifications';
import time from './time';
import scores from './scores';
import scrubbable from '../reducerEnhancers/scrubbable';


let scrubbableReducers = scrubbableReducerFactory({chatMessages, aggregators});

const reducers = Object.assign(scrubbableReducers,{
	user,
	notifications,
	room,
	time,
	scores,
	aggregatorListSlots : scrubbable(aggregatorListSlots)
});

const rootReducer = combineReducers(reducers);

export default rootReducer