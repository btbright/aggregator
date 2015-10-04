import shortid from 'shortid'
import { createAggregator, createAggregatorServerUpdate } from '../../common/models/aggregator'
import constants from '../../common/constants/App'
import { scorer } from '../../common/utils/scorer'
import { roomInfo } from './room'

function Aggregators(io, messenger){

	var activeClickers = {}

	messenger.on('roomInfo:activeClickers:update', function(roomId, activeClickerCount){
		activeClickers[roomId] = activeClickerCount;
	})

	var aggregatorState = {};
	var frameRate = 1/60;
	setInterval(updateAggregators,frameRate*1000);

	function updateAggregators(){
		Object.keys(aggregatorState).forEach(roomId => {
			var updateObjects = [];
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (storedAggregator.isComplete) return;
				var time = Date.now();
				var calculatedFrameRate = !storedAggregator.lastServerUpdate ? frameRate : (Date.now() - storedAggregator.lastServerUpdate)/1000;
				if (!activeClickers[roomId]) activeClickers[roomId] = 1
				var scoreResults = scorer(storedAggregator.clicks, time, calculatedFrameRate, storedAggregator.x, storedAggregator.velocity, activeClickers[roomId]);
				var isComplete = scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0);
				var updateObject = {
					id : aggregatorId,
					x : scoreResults.x,
					velocity : scoreResults.velocity,
					maxValue : storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x,
					isComplete : isComplete,
					completedTime : isComplete ? time : 0,
					lastServerUpdate : time
				};
				aggregatorState[roomId][aggregatorId] = Object.assign({},storedAggregator,updateObject);
				updateObjects.push(updateObject);
			});
		});
	}

	setInterval(sendUpdatedAggregators, 100)
	function sendUpdatedAggregators(){
		Object.keys(aggregatorState).forEach(roomId => {
			var updateObjects = [];
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (storedAggregator.isComplete && storedAggregator.lastServerUpdate > storedAggregator.completedTime) return;
				updateObjects.push(createAggregatorServerUpdate(storedAggregator));
			});
			io.to(roomId).emit("aggregators:update",updateObjects);
		});
	}

	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);
			aggregator.id = shortid.generate();

			if (!aggregatorState[socket.currentRoom]){
				aggregatorState[socket.currentRoom] = {}
			}
			aggregatorState[socket.currentRoom][aggregator.id] = aggregator;

			socket.broadcast.to(socket.currentRoom).emit('aggregator:new',aggregator);
			socket.emit('aggregator:accepted', requestedAggregator.id, aggregator.id);
			updateAggregators()
		});
		//TODO - compare to last click instead of Date.now(), but haven't implemented state on server yet
		var lastClick = false;
		socket.on('aggregator:click:new',function(requestedAggregatorId, click){
			if (lastClick && (Date.now() - lastClick < constants.Aggregator.CLICKTHRESHOLD)) return;
			lastClick = click;
			if (aggregatorState[socket.currentRoom] && aggregatorState[socket.currentRoom][requestedAggregatorId]){
				aggregatorState[socket.currentRoom][requestedAggregatorId].clicks.push(click);
			}
			updateAggregators()
			socket.broadcast.to(socket.currentRoom).emit('aggregator:click:new',requestedAggregatorId, click);
		});
	});
}

export default Aggregators