import shortid from 'shortid'
import { createAggregator } from '../../common/models/aggregator'

function Aggregators(io){
	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);
			aggregator.id = shortid.generate();
			socket.broadcast.to(socket.currentRoom).emit('aggregator:new',aggregator);
			socket.emit('aggregator:accepted', requestedAggregator.id, aggregator.id);
		});

		socket.on('aggregator:click:new',function(requestedAggregatorId, click){
			socket.broadcast.to(socket.currentRoom).emit('aggregator:click:new',requestedAggregatorId, click);
			//might be nice -- socket.to(socket.currentRoom).emit('aggregator:click:accpeted', requestedAggregatorId);
		});
	});
}

export default Aggregators