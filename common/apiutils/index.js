import room from './room'
import chat from './chat'
import aggregators from './aggregators'
import bufferedUpdates from './bufferedUpdates'

export default (socket) => {
	const apiHandlerDefinitions = [room, chat, aggregators, bufferedUpdates];
	const apiHandlers = apiHandlerDefinitions.map(apiHandlerFactory);

	return [apiHandlers, function(dispatch){
		//listen for server messages
		apiHandlers
			.map(apiHandler => apiHandler.remote)
			.forEach(remoteHandler => remoteHandler(socket, dispatch));

		socket.on();
	}]
}

function apiHandlerFactory(apiDefinition){
	return {
		remote : (socket, dispatch) => {
			Object.keys(apiDefinition.remoteToLocalMap).forEach(remoteEventName => {
				socket.on(remoteEventName, function(){
					const actions = prepareActions(apiDefinition.remoteToLocalMap[remoteEventName]).apply(null, arguments);
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

function prepareActions(actionCreator){
	return function(){
		let actions = actionCreator.apply(null, arguments);
		if (!actions) return;
		if (typeof actions.length === 'undefined'){
			actions = [actions];
		}
		actions.forEach(action => {
			action.isRemoteTriggered = true;
			//console.log(action)
		});
		return actions;
	}
}