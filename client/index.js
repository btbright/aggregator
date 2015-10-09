import React from 'react';
import { Provider } from 'react-redux';
import constants from '../common/constants/App'
import configureStore from '../common/store/configureStore';
import App from '../common/containers/app';
import ActivitySimulator from './simulation/ActivitySimulator';
import setupApiUtils from '../common/apiutils';
import { moveToTime } from '../common/actions/bufferedUpdates';

let initialState = window.__INITIAL_STATE__;
initialState.chatMessages = undefined;
initialState.time = undefined;
const socket = io();
const [apiHandlers, startListeners] = setupApiUtils(socket);
const store = configureStore(initialState, socket, apiHandlers.map(handler => handler.local));
startListeners(store.dispatch);

animLoop(function(dt){
	const offset = 100;
	store.dispatch(moveToTime(Date.now()-offset));
});

function animLoop( render ) {
    var running, lastFrame = +new Date;
    function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
            requestAnimationFrame( loop );
            var deltaT = now - lastFrame;
            // do not render frame when deltaT is too high
            if ( deltaT < 50 ) {
                running = render( deltaT );
            }
            lastFrame = now;
        }
    }
    loop( lastFrame );
}

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