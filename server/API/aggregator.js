import { createAggregator } from '../../common/models/aggregator'
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

	const initializationTime = 1500;
	const completedTime = 3500;
	const retirementTime = 400;

	function updateAggregators(){
		Object.keys(aggregatorState).forEach(roomId => {
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (storedAggregator.state === 'removed') return;
				var time = Date.now();
				var calculatedFrameRate = !storedAggregator.lastServerUpdate ? frameRate : (time - storedAggregator.lastServerUpdate)/1000;
				if (!activeClickers[roomId]) activeClickers[roomId] = 1

				var newState = storedAggregator.state,
				    hasStateChange = false,
				    hasUpdate = false,
				    scoreResults;

				if (newState === 'initializing' && storedAggregator.lastServerUpdate === 0){
					hasUpdate = true;
				}

				if (newState === 'initializing' && time - storedAggregator.createdTime > initializationTime){
					newState = 'aggregating';
					hasStateChange = true;
				}

				if (newState === 'aggregating'){
					hasUpdate = true;
					scoreResults = scorer(storedAggregator.activePresserCount, time, calculatedFrameRate, storedAggregator.x, storedAggregator.velocity, activeClickers[roomId]);
					var isComplete = scoreResults.x === 100 || (scoreResults.x === 0 && storedAggregator.maxValue != 0);
					if (isComplete && !hasStateChange){
						newState = 'completed';
				    	hasStateChange = true;
					}
				}

				if (newState === 'completed'  && !hasStateChange &&  time - storedAggregator.lastStateChangeTime > completedTime){
					newState = 'retired';
				    hasStateChange = true;
				}

				if (newState === 'retired'  && !hasStateChange && time - storedAggregator.lastStateChangeTime > retirementTime){
					newState = 'removed';
				    hasStateChange = true;
				}

				var x = storedAggregator.x,
					velocity = storedAggregator.velocity,
					maxValue = storedAggregator.maxValue;

				if (scoreResults){
					x = Math.round(scoreResults.x * 100) / 100;
					velocity = scoreResults.velocity;
					maxValue = Math.round((storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x) * 100) / 100;
				}

				if (hasUpdate || hasStateChange){
					var updateObject = {
						state : newState,
						id : aggregatorId,
						x : x,
						activePresserCount : storedAggregator.activePresserCount,
						velocity : velocity,
						maxValue : maxValue,
						lastStateChangeTime : hasStateChange ? time : storedAggregator.lastStateChangeTime,
						lastServerUpdate : time
					};
					aggregatorState[roomId][aggregatorId] = Object.assign({},storedAggregator,updateObject);
				}
			});
		});
	}

	var aggregatorUpdateSnapshots = {};
	var lastUpdate = 0;

	setInterval(sendUpdatedAggregators, 100)
	function sendUpdatedAggregators(){
		const thisUpdate = Date.now()
		Object.keys(aggregatorState).forEach(roomId => {
			var updateObjects = [];
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (!aggregatorUpdateSnapshots[roomId]){
					aggregatorUpdateSnapshots[roomId] = {}
				}
				var lastSnapshot = aggregatorUpdateSnapshots[roomId][aggregatorId];
				if (storedAggregator !== lastSnapshot){
					updateObjects.push(createAggregatorServerUpdate(storedAggregator, lastSnapshot));
					aggregatorUpdateSnapshots[roomId][aggregatorId] = storedAggregator;
				}
			});
			if (updateObjects.length !== 0)
			{
				let updateObject = {
					aggregators : {
						[thisUpdate] : updateObjects
					}
				};
				io.to(roomId).emit('update:new',updateObject);
			}
		});
		lastUpdate = thisUpdate;
	}

	var aggTest = 0;

	function createAggregatorServerUpdate(aggregator, lastSnapshot){
		if (!lastSnapshot){
			return {
				type : 'ADD_AGGREGATORS',
				isUpdateAction : true,
				key : aggregator.id,
				keyField : 'id',
				entity : aggregator
			}
		}

		var mutations = [];
		['x','maxValue','state','activePresserCount'].forEach(mutationField => {
			var oldValue = lastSnapshot[mutationField];
			var newValue = aggregator[mutationField];
			if (oldValue !== newValue){
				if (typeof oldValue === 'number' && typeof newValue === 'number'){
					mutations.push({
						type : 'addition',
						property : mutationField,
						value : aggregator[mutationField] - lastSnapshot[mutationField]
					});
				} else if (typeof oldValue === 'string' && typeof newValue === 'string'){
					mutations.push({
						type : 'replacement',
						property : mutationField,
						value : aggregator[mutationField]
					});
				}
			}
		});

		return {
				type : 'UPDATE_AGGREGATORS',
				isUpdateAction : true,
				key : aggregator.id,
				keyField : 'id',
				mutations : mutations
			}
	}

	function createClientAggregator(aggregator){
		return {
			id : aggregator.id,
			createdTime : aggregator.createdTime,
			x : aggregator.x,
			maxValue : aggregator.maxValue,
			state : aggregator.state,
			activePresserCount : aggregator.activePresserCount,
			objectId : aggregator.objectId,
			objectType : aggregator.objectType,
			userName : aggregator.userName
		}
	}

	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);

			if (!aggregatorState[socket.currentRoom]){
				aggregatorState[socket.currentRoom] = {}
			}
			aggregatorState[socket.currentRoom][aggregator.id] = aggregator;
		});

		socket.on('aggregator:pressing:change',function(aggregatorId, isPressing){
			if (aggregatorState[socket.currentRoom] && 
				aggregatorState[socket.currentRoom][aggregatorId] && 
				(aggregatorState[socket.currentRoom][aggregatorId].state === 'initializing' ||
					aggregatorState[socket.currentRoom][aggregatorId].state === 'initializing')){
				aggregatorState[socket.currentRoom][aggregatorId].activePresserCount += isPressing ? 1 : -1;
			}
		});
	});
}

export default Aggregators