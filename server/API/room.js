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

	messenger.on('user:points:update', (socketId, pointsAddition) => {
			var socket = io.sockets.connected[socketId];
			var room = roomInfo[socket.currentRoom];
			if (!Object.keys(room.users).includes(socket.userName)) return;

			let userObject = room.users[userName];
			if (!userObject.points) userObject.points = 0;
			userObject.points += pointsAddition;
			io.to(roomId).emit('user:points:update',socket.userName, userObject.points);
		});


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
			if (!room.users){
				room.users = {};
			}
			if (Object.keys(room.users).includes(name)){
				socket.emit('error:user:name:change','Someone is using that name. Please choose another.');
				return;
			}
			room.users[name] = {name};
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
			if (roomInfo[socket.currentRoom].users) delete roomInfo[socket.currentRoom].users[socket.userName];
			roomInfo[socket.currentRoom].userCount--;
			io.to(socket.currentRoom).emit('room:userCount:update', roomInfo[socket.currentRoom].userCount);
		});
	});
}

export default Room