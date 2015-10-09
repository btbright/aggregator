import React from 'react';
import { Provider } from 'react-redux';
import constants from '../common/constants/App'
import configureStore from '../common/store/configureStore';
import App from '../common/containers/app';
import ActivitySimulator from './simulation/ActivitySimulator';
import setupApiUtils from '../common/apiutils';

let initialState = window.__INITIAL_STATE__;
initialState.chatMessages = undefined;
const socket = io();
const [apiHandlers, startListeners] = setupApiUtils(socket);
const store = configureStore(initialState, socket, apiHandlers.map(handler => handler.local));
startListeners(store.dispatch)

if (false){
	var simulator = new ActivitySimulator(store.getState, store.dispatch);
	simulator.run();
}

const rootElement = document.getElementById(constants.React.ROOTELEMENTID);

React.render(
  <Provider store={store}>
    {() => <App/>}
  </Provider>,
  rootElement
);