import { createChatMessage } from '../../common/models/chatMessage'

function Chat(io){
	io.on('connection', function (socket) {
		socket.on('chatMessage:new',function(requestedMessage){
			var message = createChatMessage(requestedMessage);
			//validate
			socket.broadcast.to(socket.currentRoom).emit('chatMessage:new',message);
		});
	});
}

export default Chat