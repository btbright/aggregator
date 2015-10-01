import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'
import room from './room'
import user from './user'

const rootReducer = combineReducers({
  chatMessages,
  aggregators,
  room,
  user
});

export default rootReducer