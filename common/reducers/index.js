import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'
import aggregatorListSlots from './aggregatorListSlots'
import room from './room'
import user from './user'
import notifications from './notifications'

const rootReducer = combineReducers({
  chatMessages,
  aggregators,
  aggregatorListSlots,
  room,
  user,
  notifications
});

export default rootReducer