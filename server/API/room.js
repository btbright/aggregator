function Room(io, messenger){

	var roomInfo = {}
	setInterval(updateActiveClickers,1000)
	function updateActiveClickers(){
		var timeToCheck = Date.now()
		var threshold = 1000 * 60 * 2;
		Object.keys(roomInfo).forEach(roomId => {
			if (!roomInfo[roomId].activeClickers) return;
			var oldCount = Object.keys(roomInfo[roomId].activeClickers).length;
			Object.keys(roomInfo[roomId].activeClickers).forEach(socketId => {
				if (timeToCheck - roomInfo[roomId].activeClickers[socketId] > threshold){
					delete roomInfo[roomId].activeClickers[socketId];
				}
			})
			var newCount = Object.keys(roomInfo[roomId].activeClickers).length;
			if (oldCount != newCount){
				messenger.emit('room:activeClickers:update', roomId, newCount)
				io.to(roomId).emit('room:activeClickers:update',newCount)
			}
		})
	}

	io.on('connection', function (socket) {
		socket.on("room:change",function(requestInfo){
			//check if real room, etc.
			//update counts
			if (!roomInfo[requestInfo.newRoom]){
				roomInfo[requestInfo.newRoom] = {}
				roomInfo[requestInfo.newRoom].userCount = 1;
			} else {
				roomInfo[requestInfo.newRoom].userCount++;
			}
			if (requestInfo.oldRoom){
				socket.leave(requestInfo.oldRoom);
				roomInfo[requestInfo.oldRoom].userCount--;
				io.to(requestInfo.oldRoom).emit('room:userCount:update', roomInfo[requestInfo.oldRoom].userCount);
			}
			//join user to new room
			socket.currentRoom = requestInfo.newRoom;
			socket.join(requestInfo.newRoom);
			io.to(requestInfo.newRoom).emit('room:userCount:update', roomInfo[requestInfo.newRoom].userCount);
		});

		socket.on("user:name:change",function(name){
			var room = roomInfo[socket.currentRoom];
			if (!room) return; //oops
			if (!room.names){
				room.names = [];
			}
			if (room.names.includes(name)){
				socket.emit('error:user:name:change','Someone is using that name. Please choose another.');
				return;
			}
			room.names.push(name);
			socket.userName = name;
		});


		socket.on('aggregator:new',addActiveClicker);
		socket.on('aggregator:pressing:change',addActiveClicker);

		function addActiveClicker(){
			if (!roomInfo[socket.currentRoom]){
				roomInfo[socket.currentRoom] = {}
			}
			if (!roomInfo[socket.currentRoom].activeClickers){
				roomInfo[socket.currentRoom].activeClickers = {}
			}
			var update = false;
			if (!roomInfo[socket.currentRoom].activeClickers[socket.id]){
				update = true;
			}
			roomInfo[socket.currentRoom].activeClickers[socket.id] = Date.now();
			if (update){
				var activeClickerCount = Object.keys(roomInfo[socket.currentRoom].activeClickers).length
				messenger.emit('room:activeClickers:update', socket.currentRoom, activeClickerCount)
				io.to(socket.currentRoom).emit('room:activeClickers:update',activeClickerCount)
			}
		}

		socket.on('disconnect', function () {
			if (!roomInfo[socket.currentRoom]) return;
			if (roomInfo[socket.currentRoom].names) roomInfo[socket.currentRoom].names.splice(roomInfo[socket.currentRoom].names.indexOf(socket.userName),1);
			roomInfo[socket.currentRoom].userCount--;
			io.to(socket.currentRoom).emit('room:userCount:update', roomInfo[socket.currentRoom].userCount);
		});
	});
}

export default Room