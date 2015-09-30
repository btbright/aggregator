function Room(io){
	var userCount = {};

	io.on('connection', function (socket) {
		socket.on("room:change",function(requestInfo){
			//check if real room, etc.
			//update counts
			if (!userCount[requestInfo.newRoom]){
				userCount[requestInfo.newRoom] = 1;
			} else {
				userCount[requestInfo.newRoom]++;
			}
			if (requestInfo.oldRoom){
				socket.leave(requestInfo.oldRoom);
				userCount[requestInfo.oldRoom]--;
				io.to(requestInfo.oldRoom).emit('userCount:update', userCount[requestInfo.oldRoom]);
			}
			//join user to new room
			socket.currentRoom = requestInfo.newRoom;
			socket.join(requestInfo.newRoom);
			io.to(requestInfo.newRoom).emit('userCount:update', userCount[requestInfo.newRoom]);
		});

		socket.on('disconnect', function () {
			userCount[socket.currentRoom]--;
			io.to(socket.currentRoom).emit('userCount:update', userCount[socket.currentRoom] );
		});
	});
}

export default Room