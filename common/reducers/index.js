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


let scrubbableReducers = scrubbableReducerFactory({chatMessages, aggregators});

const reducers = Object.assign(scrubbableReducers,{
	aggregatorListSlots,
	user,
	notifications,
	room,
	time,
	scores
});

const rootReducer = combineReducers(reducers);

export default rootReducer