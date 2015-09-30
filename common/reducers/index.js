import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'
import room from './room'

const rootReducer = combineReducers({
  chatMessages,
  aggregators,
  room
});

export default rootReducer