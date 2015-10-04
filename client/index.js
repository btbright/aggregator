import React from 'react';
import { Provider } from 'react-redux';
import constants from '../common/constants/App'
import configureStore from '../common/store/configureStore';
import App from '../common/containers/App';
import ActivitySimulator from './simulation/ActivitySimulator';


const initialState = window.__INITIAL_STATE__;

const store = configureStore(initialState);

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