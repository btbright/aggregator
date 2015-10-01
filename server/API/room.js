function Room(io){
	var roomInfo = {};

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
				io.to(requestInfo.oldRoom).emit('roomInfo:userCount:update', roomInfo[requestInfo.oldRoom].userCount);
			}
			//join user to new room
			socket.currentRoom = requestInfo.newRoom;
			socket.join(requestInfo.newRoom);
			io.to(requestInfo.newRoom).emit('roomInfo:userCount:update', roomInfo[requestInfo.newRoom].userCount);
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

		socket.on('disconnect', function () {
			if (!roomInfo[socket.currentRoom]) return;
			roomInfo[socket.currentRoom].names.splice(roomInfo[socket.currentRoom].names.indexOf(socket.userName),1);
			roomInfo[socket.currentRoom].userCount--;
			io.to(socket.currentRoom).emit('roomInfo:userCount:update', roomInfo[socket.currentRoom].userCount);
		});
	});
}

export default Room