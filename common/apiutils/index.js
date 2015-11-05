import room from './room'
import chat from './chat'
import aggregators from './aggregators'
import connection from './connection'
import bufferedUpdates from './bufferedUpdates'

export default (socket) => {
	const apiHandlerDefinitions = [room, chat, aggregators, bufferedUpdates, connection];
	const apiHandlers = apiHandlerDefinitions.map(apiHandlerFactory);

	return [apiHandlers, function(getState, dispatch){
		//listen for server messages
		apiHandlers
			.map(apiHandler => apiHandler.remote)
			.forEach(remoteHandler => remoteHandler(socket, getState, dispatch));
	}]
}

function apiHandlerFactory(apiDefinition){
	return {
		remote : (socket, getState, dispatch) => {
			Object.keys(apiDefinition.remoteToLocalMap).forEach(remoteEventName => {
				socket.on(remoteEventName, function(){
					dispatch({
						type : 'SOCKET_RECEIVED',
						data : arguments
					})
					const actions = prepareActions(dispatch, getState, apiDefinition.remoteToLocalMap[remoteEventName]).apply(null, arguments);
					actions.forEach(dispatch);
				});
			});
		},
		local : (action) => {
			if (action.remoteTriggered) return;
			const eventIndex = Object.keys(apiDefinition.localToRemoteMap).indexOf(action.type);
			if (eventIndex === -1) return;
			return apiDefinition.localToRemoteMap[action.type](action);
		}
	}
}

function prepareActions(dispatch, getState, actionCreator){
	return function(){
		let actions = actionCreator.apply(null, arguments);
		if (!actions) return;
		if (!Array.isArray(actions)){
			actions = [actions];
		}
		let returnActions = [];
		actions.forEach(action => {
			if (typeof action === 'function'){
				let results = action(dispatch, getState);
				if (results){
					if (!Array.isArray(results)){
						results = [results];
					}
					results.forEach(result => {
						result.isRemoteTriggered = true;
						returnActions.push(result);
					})
				}
			} else {
				action.isRemoteTriggered = true;
				returnActions.push(action)
			}
		});
		return returnActions;
	}
}