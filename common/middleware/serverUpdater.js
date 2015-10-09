export default (socket, localHandlers) => store => next => action => {
	if (!localHandlers){
		next(action);
		return;
	}

	//listen for actions to send to server
	localHandlers.forEach(localHandler => {
		if (!action.isRemoteTriggered){
			const emitInstructions = localHandler(action);
			if (emitInstructions){
				socket.emit(emitInstructions.event, ...emitInstructions.data);
			}
		}
	});

	next(action);
}