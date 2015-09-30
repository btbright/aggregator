import React from 'react';
import { Provider } from 'react-redux';
import constants from '../common/constants/App'
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import bindAPIListeners from '../common/apiutils/';
import { requestUpdateRoom } from '../common/actions/room'


const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);

//start the server listeners and give them the dispatch function to respond with
bindAPIListeners(store.dispatch);
//tell the server to attach us to the right room
store.dispatch(requestUpdateRoom(store.getState().room.name));

const rootElement = document.getElementById(constants.React.ROOTELEMENTID);

React.render(
  <Provider store={store}>
    {() => <App/>}
  </Provider>,
  rootElement
);