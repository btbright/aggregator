import { combineReducers } from 'redux';
import chatMessages from './chat';
import aggregators from './aggregators'

const rootReducer = combineReducers({
  chatMessages,
  aggregators
});

export default rootReducer