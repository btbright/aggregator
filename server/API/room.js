import constants from '../../common/constants/App'

function Room(io, messenger){

	var roomInfo = {}
	setInterval(updateActiveClickers,constants.Room.SERVERUPDATEFREQUENCY)
	function updateActiveClickers(){
		var timeToCheck = Date.now()
		Object.keys(roomInfo).forEach(roomId => {
			if (!roomInfo[roomId].activeClickers) return;
			var oldCount = Object.keys(roomInfo[roomId].activeClickers).length;
			Object.keys(roomInfo[roomId].activeClickers).forEach(socketId => {
				if (timeToCheck - roomInfo[roomId].activeClickers[socketId] > constants.Room.ACTIVECLICKERTIMETHRESHOLD){
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

	//brittle. Should be tracking the user per room, not guessing room from username
	messenger.on('user:points:update', (userName, pointsAddition) => {
		var roomName = Object.keys(roomInfo).find(r => {
			if (!roomInfo[r] || !roomInfo[r].users) return false;
			return Object.keys(roomInfo[r].users).includes(userName);
		});
		var room = roomInfo[roomName];
		if (!roomName || !room) return;

		let userObject = room.users[userName];
		if (!userObject.points) userObject.points = 0;
		userObject.points += pointsAddition;
		io.to(roomName).emit('user:points:update',userName, userObject.points, pointsAddition);
	});

	function openCloseRoom(roomName){
		if (roomInfo[roomName].userCount >= constants.App.MAXUSERS){
			messenger.emit('room:isOpen:change', roomName, false)
		} else {
			messenger.emit('room:isOpen:change', roomName, true)
		}
	}

	io.on('connection', function (socket) {

		socket.on('timeCorrection:ping', function(clientTime){
			socket.emit('timeCorrection:pong', clientTime, Date.now());
		});

		socket.on("room:change",function(requestInfo){
			//check if real room, etc.
			//update counts
			if (!roomInfo[requestInfo.newRoom]){
				roomInfo[requestInfo.newRoom] = {}
				roomInfo[requestInfo.newRoom].userCount = 1;
			} else {
				roomInfo[requestInfo.newRoom].userCount++;
			}
			openCloseRoom(requestInfo.newRoom);

			if (requestInfo.oldRoom){
				socket.leave(requestInfo.oldRoom);
				roomInfo[requestInfo.oldRoom].userCount--;
				io.to(requestInfo.oldRoom).emit('room:userCount:update', roomInfo[requestInfo.oldRoom].userCount);
				openCloseRoom(requestInfo.oldRoom);
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


		socket.on('aggregator:nominate',addActiveClicker);
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
			openCloseRoom(socket.currentRoom);
			io.to(socket.currentRoom).emit('room:userCount:update', roomInfo[socket.currentRoom].userCount);
			io.to(socket.currentRoom).emit('user:points:remove',socket.userName);
		});
	});
}

export default Room