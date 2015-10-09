import { combineReducers } from 'redux';
import scrubbableReducerFactory from '../reducerEnhancers/scrubbableReducerFactory';
import chatMessages from './chat';
import aggregators from './aggregators';
import aggregatorListSlots from './aggregatorListSlots';
import room from './room';
import user from './user';
import notifications from './notifications';
import time from './time';


let scrubbableReducers = scrubbableReducerFactory({chatMessages});

const reducers = Object.assign(scrubbableReducers,{
	aggregatorListSlots,
	user,
	notifications,
	room,
	time
});

const rootReducer = combineReducers(reducers);

export default rootReducer