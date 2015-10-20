import { createAggregator } from '../../common/models/aggregator'
import constants from '../../common/constants/App'
import { scorer } from '../../common/utils/scorer'
import { roomInfo } from './room'
import { getLevel } from '../../common/utils/levels'

function Aggregators(io, messenger){
	var activeClickers = {}

	messenger.on('room:activeClickers:update', function(roomId, activeClickerCount){
		activeClickers[roomId] = activeClickerCount;
	})

	var aggregatorState = {};
	var frameRate = 1/60;
	setInterval(updateAggregators,frameRate*1000);

	const initializationTime = constants.Aggregator.INITIALIZATIONTIME;
	const completedTime = constants.Aggregator.COMPLETEDTIME;
	const retirementTime = constants.Aggregator.RETIREMENTTIME;

	function updateAggregators(){
		Object.keys(aggregatorState).forEach(roomId => {
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (storedAggregator.state === 'removed') return;
				var time = Date.now();
				var calculatedFrameRate = storedAggregator.lastServerUpdate !== 0 ? frameRate : (time - storedAggregator.lastServerUpdate)/1000;
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
					//if no one is holding down a comment, just end it
					if (storedAggregator.activePresserCount === 0){
						newState = 'completed';
					}
				}

				if (newState === 'aggregating'){
					hasUpdate = true;
					scoreResults = scorer(storedAggregator.activePresserCount, calculatedFrameRate, storedAggregator.x, storedAggregator.velocity, activeClickers[roomId]);
					var isComplete = scoreResults.x >= 100 || scoreResults.x <= 0;
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

				if (false){
					if (hasStateChange){
						console.log('state change: ',newState)
					}
					if (hasUpdate){
						console.log('activePresserCount: ',storedAggregator.activePresserCount)
					}
				}

				if (hasStateChange && newState === 'completed'){
					var aggPoints = getMaxValuePoints(maxValue)
					messenger.emit('user:points:update', storedAggregator.objectUserName, aggPoints);
					messenger.emit('user:points:update', storedAggregator.userName, aggPoints !== 15 ? Math.round(aggPoints/5) : -10);
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
						lastServerUpdate : time,
						level : getLevel(maxValue)
					};
					aggregatorState[roomId][aggregatorId] = Object.assign({},storedAggregator,updateObject);
				}
			});
		});
	}

	function getMaxValuePoints(maxValue){
		switch (getLevel(maxValue)){
		case 0:
			return 15;
		case 1:
			return 40;
		case 2:
			return 70;
		case 3:
			return 100;
		default:
			return 0;
		}
	}

	var aggregatorUpdateSnapshots = {};
	var lastUpdate = 0;

	setInterval(sendUpdatedAggregators, constants.Aggregator.SERVERUPDATEFREQUENCY)
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
					updateObjects.push(createAggregatorServerUpdate(thisUpdate, storedAggregator, lastSnapshot));
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

				let hasAggregatorAdd = false;
				updateObject.aggregators[thisUpdate].forEach(update => {
					if (update.type === 'ADD_AGGREGATORS'){
						hasAggregatorAdd = true;
					}
				})

				//setTimeout for latency simulation
				setTimeout(()=>{
					io.to(roomId).emit('update:new',updateObject);
				//},hasAggregatorAdd ? 500 : 0)
				//},Math.random() > 0.9 ? 500 : 0)
				//},424)
				},0)
			}
		});
		lastUpdate = thisUpdate;
	}

	var aggTest = 0;

	function createAggregatorServerUpdate(time, aggregator, lastSnapshot){
		if (!lastSnapshot){
			return {
				type : 'ADD_AGGREGATORS',
				time : time,
				key : aggregator.id,
				keyField : 'id',
				entity : aggregator
			}
		}

		var mutations = [];
		['x','maxValue','state','activePresserCount','level', 'velocity'].forEach(mutationField => {
			mutations.push({
				property : mutationField,
				value : aggregator[mutationField]
			});
		});

		return {
				type : 'UPDATE_AGGREGATORS',
				time : time,
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
			userName : aggregator.userName,
			level : aggregator.level
		}
	}

	io.on('connection', function (socket) {
		socket.on('aggregator:new',function(requestedAggregator){
			var aggregator = createAggregator(requestedAggregator);

			if (!aggregatorState[socket.currentRoom]){
				aggregatorState[socket.currentRoom] = {}
			}
			var existingAggregator = Object.keys(aggregatorState[socket.currentRoom]).find(k => aggregatorState[socket.currentRoom][k].objectId === requestedAggregator.objectId);
			if (!existingAggregator){
				aggregatorState[socket.currentRoom][aggregator.id] = aggregator;
			} else {
				socket.emit('error:aggregator:new', requestedAggregator.id, existingAggregator.id);
			}
		});

		socket.on('aggregator:pressing:change',function(aggregatorId, isPressing){
			if (!aggregatorState[socket.currentRoom] || !aggregatorState[socket.currentRoom][aggregatorId]) return;

			var storedAggregator = aggregatorState[socket.currentRoom][aggregatorId];
			if (storedAggregator.state === 'aggregating' || storedAggregator.state === 'initializing'){
				aggregatorState[socket.currentRoom][aggregatorId] = Object.assign({},storedAggregator,{
					activePresserCount : storedAggregator.activePresserCount + (isPressing ? 1 : -1)
				});
			}
		});
	});
}

export default Aggregators