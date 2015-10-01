import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'
import aggregatorListSlots from './aggregatorListSlots'
import room from './room'
import user from './user'

const rootReducer = combineReducers({
  chatMessages,
  aggregators,
  aggregatorListSlots,
  room,
  user
});

export default rootReducer