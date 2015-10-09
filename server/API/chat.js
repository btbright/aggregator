import { createChatMessage } from '../../common/models/chatMessage'

function Chat(io){

	var chatState = {};
	var lastUpdate = 0;

	setInterval(sendUpdate, 100)
	function sendUpdate(){
		const thisUpdate = Date.now()
		Object.keys(chatState).forEach(roomId => {
			var updateObjects = [];
			Object.keys(chatState[roomId]).forEach(chatMessageId => {
				var savedMessage = chatState[roomId][chatMessageId];
				if (savedMessage.time > lastUpdate){
					updateObjects.push({
						type : 'ADD_CHATMESSAGES',
						key : savedMessage.id,
						keyField : 'id',
						entity : savedMessage
					});
				}
			});
			if (updateObjects.length !== 0)
			{
				let updateObject = {
					chatMessages : {
						[thisUpdate] : updateObjects
					}
				};
				console.log("sending update",updateObject)
				io.to(roomId).emit('update:new',updateObject);
			}
		});
		lastUpdate = thisUpdate;
	}

	io.on('connection', function (socket) {
		socket.on('chatMessage:new',function(requestedMessage){
			requestedMessage.time = Date.now();
			var message = createChatMessage(requestedMessage);
			//validate
			if (!chatState[socket.currentRoom]){
				chatState[socket.currentRoom] = {};
			}
			chatState[socket.currentRoom][message.id] = message;
		});
	});
}

export default Chat