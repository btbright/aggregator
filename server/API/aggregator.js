import shortid from 'shortid'
import { createAggregator } from '../../common/models/aggregator'

function Aggregators(io){
	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);
			aggregator.id = shortid.generate();
			socket.broadcast.to(socket.currentRoom).emit('aggregator:new',aggregator);
			socket.to(socket.currentRoom).emit('aggregator:accepted',{originalId : requestedAggregator.id, newId : aggregator.id});
		});
	});
}

export default Aggregators