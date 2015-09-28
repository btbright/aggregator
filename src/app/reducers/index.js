import { combineReducers } from 'redux';
import chatMessages from './chat';

const rootReducer = combineReducers({
  chatMessages
});

export default rootReducer