import { createChatMessage } from '../../common/models/chatMessage'
import constants from '../../common/constants/App'

function Chat(io, messenger){
	var chatState = {};
	var lastUpdate = 0;

	messenger.on('chatmessages:createpermagatormessage', function(roomId, permagator, storedAggregator){
		var message = createChatMessage({
			text : permagator.text,
			userName : 'errbody',
			hasAggregator : true,
			aggregatorId : storedAggregator.id
		});
		if (!chatState[roomId]){
			chatState[roomId] = {};
		}
		chatState[roomId][message.id] = message;
	})

	setInterval(sendUpdate, constants.Chat.SERVERUPDATEFREQUENCY)
	function sendUpdate(){
		const thisUpdate = Date.now()
		Object.keys(chatState).forEach(roomId => {
			var updateObjects = [];
			Object.keys(chatState[roomId]).forEach(chatMessageId => {
				var savedMessage = chatState[roomId][chatMessageId];
				if (savedMessage.time > lastUpdate){
					updateObjects.push({
						type : 'ADD_CHATMESSAGES',
						isUpdateAction : true,
						time : thisUpdate,
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