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
					const actions = prepareActions(dispatch, getState, apiDefinition.remoteToLocalMap[remoteEventName]).apply(null, arguments);
					actions.forEach(action => {
						if (typeof action === 'function'){
							action()
						} else {
							dispatch(action);
						}
					});
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
		let actions = [];
		let actionCreatorResults = actionCreator.apply(null, arguments);
		if (!actionCreatorResults) return;
		if (typeof actionCreatorResults === 'function'){
			let results = actionCreatorResults(dispatch, getState);
			if (results){
				actions = results;		
			} else {
				return actions;
			}
		}
		if (!Array.isArray(actions)){
			actions = [actions];
		}
		actions.forEach(action => {
			action.isRemoteTriggered = true;
		});
		return actions;
	}
}