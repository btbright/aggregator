import "babel/polyfill";
import React from 'react';
//import React from 'react/addons';
import { Provider } from 'react-redux';
import constants from '../common/constants/App'
import configureStore from '../common/store/configureStore';
import App from '../common/containers/app';
import ActivitySimulator from './simulation/ActivitySimulator';
import setupApiUtils from '../common/apiutils';
import { moveToTime, triggerTimeCorrection } from '../common/actions/time';
import { Map } from 'immutable'

(function () {
    var _log = console.log;
    console.log = function () {
        var converted = false;
        var args = Array.prototype.map.call(arguments, function (arg) {
            if (typeof arg === 'undefined' || arg === null) return arg;
            if (typeof arg.toJS === "function"){
                converted = true;
                return arg.toJS();
            } else {
                return arg
            };
             
        });
        return _log.apply(console, converted ? ['converted immutable in args: ', ...args] :  args);
    };
})();

/*
window.React = React.addons.Perf; // save for later console calls
  React.addons.Perf.start();
*/

let initialState = window.__INITIAL_STATE__;
initialState.chatMessages = undefined;
initialState.time = Map({
    currentTime : 0,
    isPaused : false,
    timeCompensation : 0,
    averageLatency : 0,
    isReversed : false
});
initialState.aggregators = undefined;
initialState.aggregatorListSlots = undefined;
initialState.scores = undefined;
initialState.room.startTime = Date.now();
initialState.room.totalBytes = 0;
const socket = io();
const [apiHandlers, startListeners] = setupApiUtils(socket);
const store = configureStore(initialState, socket, apiHandlers.map(handler => handler.local));
startListeners(store.getState, store.dispatch);

window.store = store;

animLoop(function(dt){
    const timeStore = store.getState().time;
    if (!timeStore.get('isPaused')){
        const timeCompensation = store.getState().time.get('timeCompensation');
        const delta = (dt > 0 ? dt : 0)*(timeStore.get('isReversed') ? -1 : 1)
        const targetTime = parseInt(timeStore.get('currentTime') + delta, 10);
        store.dispatch(moveToTime(Date.now() + timeCompensation - constants.App.BUFFERTIME));
    }
});

function animLoop( render ) {
    var running, lastFrame = +new Date;
    function loop( now ) {
        // stop the loop if render returned false
        if ( running !== false ) {
            requestAnimationFrame( loop );
            var deltaT = now - lastFrame;
            // do not render frame when deltaT is too high
            running = render( deltaT );
            lastFrame = now;
        }
    }
    loop( lastFrame );
}

store.dispatch(triggerTimeCorrection());
setInterval(()=>{
    store.dispatch(triggerTimeCorrection());
},5000)

if (false){
	var simulator = new ActivitySimulator(store.getState, store.dispatch);
	simulator.run();
}

const rootElement = document.getElementById(constants.React.ROOTELEMENTID);

React.render(
  <Provider store={store}>
    {() => <App />}
  </Provider>,
  rootElement
);