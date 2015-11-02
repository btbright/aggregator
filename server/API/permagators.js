

function Permagators(io, messenger){
	var activeClickers = {};
	var permagatorState = {};

	messenger.on('room:activeClickers:update', function(roomId, activeClickerCount){
		activeClickers[roomId] = activeClickerCount;
	})

	io.on('connection', function (socket) {
		socket.on('permagator:pressing:change',function(permagatorId, isPressing){
			if (!permagatorState[socket.currentRoom]) {
				permagatorState[socket.currentRoom] = {};
			}
			if (!permagatorState[socket.currentRoom][permagatorId]){
				permagatorState[socket.currentRoom][permagatorId] = {};
			}

			var storedPermagator = permagatorState[socket.currentRoom][permagatorId];
			if (storedPermagator.state === 'aggregating' || storedPermagator.state === 'initializing'){
				permagatorState[socket.currentRoom][permagatorId] = Object.assign({},storedPermagator,{
					activePresserCount : storedPermagator.activePresserCount + (isPressing ? 1 : -1)
				});
			}
		});
	});
}