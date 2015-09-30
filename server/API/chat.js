import shortid from 'shortid'
import { createChatMessage } from '../../common/models/chatMessage'

function Chat(io){
	io.on('connection', function (socket) {
		socket.on('chatMessage:new',function(requestedMessage){
			var message = createChatMessage(requestedMessage);
			message.id = shortid.generate();
			socket.broadcast.to(socket.currentRoom).emit('chatMessage:new',message);
			socket.emit('chatMessage:accepted',{originalId : requestedMessage.id, newId : message.id});
		});
	});
}

export default Chat