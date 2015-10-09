import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'
import aggregatorListSlots from './aggregatorListSlots'
import room from './room'
import user from './user'
import notifications from './notifications'
import scrubbableReducerFactory from '../reducerEnhancers/scrubbableReducerFactory'

let scrubbableReducers = scrubbableReducerFactory({chatMessages});

const reducers = Object.assign(scrubbableReducers,{
	aggregatorListSlots,
	user,
	notifications,
	room
});

const rootReducer = combineReducers(reducers);

export default rootReducer