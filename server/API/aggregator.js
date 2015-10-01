import shortid from 'shortid'
import { createAggregator } from '../../common/models/aggregator'
import constants from '../../common/constants/App'

function Aggregators(io){
	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);
			aggregator.id = shortid.generate();
			socket.broadcast.to(socket.currentRoom).emit('aggregator:new',aggregator);
			socket.emit('aggregator:accepted', requestedAggregator.id, aggregator.id);
		});
		//TODO - compare to last click instead of Date.now(), but haven't implemented state on server yet
		var lastClick = false;
		socket.on('aggregator:click:new',function(requestedAggregatorId, click){
			if (lastClick && (Date.now() - lastClick < constants.Aggregator.CLICKTHRESHOLD)) return;
			lastClick = click;
			socket.broadcast.to(socket.currentRoom).emit('aggregator:click:new',requestedAggregatorId, click);
		});
	});
}

export default Aggregators