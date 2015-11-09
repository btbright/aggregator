import { createAggregator, updateMutations, encodeUpdate, states, types } from '../../common/models/aggregator'
import constants from '../../common/constants/App'
import { scorer } from '../../common/utils/scorer'
import { roomInfo } from './room'
import { getLevel } from '../../common/utils/levels'

const debug = {
	events : false
}

function Aggregators(io, messenger){
	//tracks the number of active clickers per room
	var activeClickers = {}

	//tracks users' active pressing aggregator to prevent cheating
	var userPressingAggregator = {}

	messenger.on('room:activeClickers:update', function(roomId, activeClickerCount){
		activeClickers[roomId] = activeClickerCount;
	})

	var aggregatorState = {};
	var frameRate = 1/60;
	setInterval(updateAggregators,frameRate*1000);

	const completedTime = constants.Aggregator.COMPLETEDTIME;
	const retirementTime = constants.Aggregator.RETIREMENTTIME;

	//just a hash of the active ones, so when the main process is running
	//it doesn't do calculations for each one. Also, hopefully drops lookup
	//time for filtering aggs by object type
	let activeAggregators = {};

	function removeAggregatorFromActiveList(roomId, aggregatorId){
		if (!activeAggregators[roomId]) return;
		const aggregatorIndex = activeAggregators[roomId].indexOf(aggregatorId);
		activeAggregators[roomId].splice(aggregatorIndex, 1);
	}

	function addAggregatorToActiveList(roomId, aggregatorId){
		if (!activeAggregators[roomId]){
			activeAggregators[roomId] = [];
		}
		if (!aggregatorState[roomId]){
			aggregatorState[roomId] = {};
		}
		activeAggregators[roomId].push(aggregatorId);
	}

	function updateAggregators(){
		Object.keys(aggregatorState).forEach(roomId => {
			activeAggregators[roomId].forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				var time = Date.now();
				var calculatedFrameRate = storedAggregator.lastServerUpdate !== 0 ? frameRate : (time - storedAggregator.lastServerUpdate)/1000;
				if (!activeClickers[roomId]) activeClickers[roomId] = 1
				var newState = storedAggregator.state,
				    hasStateChange = false,
				    hasUpdate = false,
				    scoreResults,
				    initializedTime = storedAggregator.initializedTime;

				//first pass through update function
				if (storedAggregator.lastServerUpdate === 0){
					hasUpdate = true;
				}

				if (newState === 'nominating' && storedAggregator.nominationsCount >= constants.Aggregator.types[storedAggregator.objectType].NOMINATIONTHRESHOLD){
					hasUpdate = true;
					hasStateChange = true;
					newState = 'initializing';
					initializedTime = time;
				}

				if (newState === 'initializing' && time - initializedTime > constants.Aggregator.types[storedAggregator.objectType].INITIALIZATIONTIME){
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
				    removeAggregatorFromActiveList(roomId, storedAggregator.id);
				}

				var x = storedAggregator.x,
					velocity = storedAggregator.velocity,
					maxValue = storedAggregator.maxValue;

				if (scoreResults){
					x = Math.round(scoreResults.x * 100) / 100;
					velocity = scoreResults.velocity;
					maxValue = Math.round((storedAggregator.maxValue >= scoreResults.x ? storedAggregator.maxValue : scoreResults.x) * 100) / 100;
				}

				if (hasStateChange && newState === 'completed'){
					var aggPoints = getMaxValuePoints(maxValue)
					//this is an aggregator based on a user created object
					if (storedAggregator.objectUserName){
						messenger.emit('user:points:update', roomId, undefined, storedAggregator.objectUserName, aggPoints);
						messenger.emit('user:points:update', roomId, undefined, storedAggregator.userName, aggPoints !== 15 ? Math.round(aggPoints/5) : -10);
					} else {
						//split the points between the nominators
						storedAggregator.nominators.forEach(nominator => {
							messenger.emit('user:points:update', roomId, nominator, undefined, Math.floor(aggPoints/storedAggregator.nominators.length));
						})
					}
				}

				if (hasUpdate || hasStateChange){
					var updateObject = {
						state : newState,
						id : aggregatorId,
						x : x,
						velocity : velocity,
						maxValue : maxValue,
						lastStateChangeTime : hasStateChange ? time : storedAggregator.lastStateChangeTime,
						lastServerUpdate : time,
						initializedTime : initializedTime ? initializedTime : storedAggregator.initializedTime,
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
			var addObjects = []
			var updateObjects = [];
			Object.keys(aggregatorState[roomId]).forEach(aggregatorId => {
				var storedAggregator = aggregatorState[roomId][aggregatorId];
				if (!aggregatorUpdateSnapshots[roomId]){
					aggregatorUpdateSnapshots[roomId] = {}
				}
				var lastSnapshot = aggregatorUpdateSnapshots[roomId][aggregatorId];
				if (storedAggregator !== lastSnapshot){
					if (!lastSnapshot){
						addObjects.push({
							type : 'ADD_AGGREGATORS',
							time : thisUpdate,
							isUpdateAction : true,
							key : storedAggregator.id,
							keyField : 'id',
							entity : storedAggregator
						})
					} else {
						updateObjects.push(createAggregatorServerUpdate(storedAggregator));
					}
					aggregatorUpdateSnapshots[roomId][aggregatorId] = storedAggregator;
				}
			});

			if (updateObjects.length !== 0)
			{
				let updateObject = encodeUpdate(updateObjects);

				setTimeout(()=>{
					io.to(roomId).emit('12',thisUpdate, updateObject);
				},0)
			}

			if (addObjects.length !== 0)
			{
				let addObject = {
					aggregators : {
						[thisUpdate] : addObjects
					}
				};
				setTimeout(()=>{
					io.to(roomId).emit('update:new',addObject);
				},0)
				 
			}
		});
		lastUpdate = thisUpdate;
	}

	var aggTest = 0;
	function createAggregatorServerUpdate(aggregator){
		var mutations = [];
		updateMutations.forEach(mutationField => {
			if (mutationField.name === 'state'){
				mutations.push(states[aggregator[mutationField.name]])	
			} else {
				mutations.push(aggregator[mutationField.name])
			}
		});
		return {id : aggregator.id, type : types[aggregator.objectType], objectId : aggregator.objectId, mutations}
	}

	function unnominateAggregator(roomId, socketId, aggregatorId){
		const aggregator = aggregatorState[roomId][aggregatorId];
		aggregatorState[roomId][aggregatorId] = Object.assign({}, aggregator,{
			nominationsCount : aggregator.nominationsCount-1,
			nominators : aggregator.nominators.filter(n => n !== socketId),
			activePresserCount : aggregator.activePresserCount-1
		});
		if (userPressingAggregator[roomId][socketId] === aggregatorId){
			userPressingAggregator[roomId][socketId] = "";
		}
	}

	function nominateAggregator(roomId, socketId, aggregatorId){
		const aggregator = aggregatorState[roomId][aggregatorId];
		aggregatorState[roomId][aggregatorId] = Object.assign({}, aggregator,{
			nominationsCount : aggregator.nominationsCount+1,
			nominators : aggregator.nominators.concat([socketId]),
			activePresserCount : aggregator.activePresserCount+1
		});
		if (userPressingAggregator[roomId][socketId] !== aggregatorId){
			userPressingAggregator[roomId][socketId] = aggregatorId;
		}
	}

	io.on('connection', function (socket) {
		socket.on('aggregator:nominate',function(requestedAggregator){
			if (debug.events) console.log('aggregator:nominate')
			//create an aggregator based on the request, we may use it, we may not
			var aggregator = createAggregator(requestedAggregator);
			//prep active aggregators to prevent null errors
			if (!activeAggregators[socket.currentRoom]){
				activeAggregators[socket.currentRoom] = [];
			}
			//check if there is an active/nominating aggregator for the requested object
			var activeAggregatorId = activeAggregators[socket.currentRoom].find(k => aggregatorState[socket.currentRoom][k].objectId === requestedAggregator.objectId);
			//prep user pressing hash to prevent null errors
			if (!userPressingAggregator[socket.currentRoom]){
				userPressingAggregator[socket.currentRoom] = {}
			}
			//get id of aggregator the user is currently pressing
			const userCurrentlyPressingId = userPressingAggregator[socket.currentRoom][socket.id];
			//requested aggregator to nominate
			const requestedAggregatorId = (activeAggregatorId ? activeAggregatorId : aggregator.id);
			//if the user was actively pressing another aggregator, deactivate it. only one at a time allowed
			if (userCurrentlyPressingId && userCurrentlyPressingId !== requestedAggregatorId){
				unnominateAggregator(socket.currentRoom, socket.id, userCurrentlyPressingId)
			}

			//if there isn't an active/nominating aggregator for this object
			if (!activeAggregatorId){
				aggregator.nominators = [socket.id];
				addAggregatorToActiveList(socket.currentRoom, aggregator.id);
				aggregatorState[socket.currentRoom][aggregator.id] = aggregator;
				userPressingAggregator[socket.currentRoom][socket.id] = aggregator.id;
			} else {
				let storedAggregator = aggregatorState[socket.currentRoom][activeAggregatorId];
				if (storedAggregator.state === 'nominating'){
					//check if nominating user has already nominated / deactivate nomination if so
					if (storedAggregator.nominators && storedAggregator.nominators.includes(socket.id)){
						unnominateAggregator(socket.currentRoom, socket.id, activeAggregatorId)
					} else {
						nominateAggregator(socket.currentRoom, socket.id, activeAggregatorId)
					}
				}
				//else don't do anything... effectively a cool-down period
			}
		});

		function selectDeselectAggregator(roomId, socketId, isPressing, aggregatorId){
			const aggregator = aggregatorState[roomId][aggregatorId];
			aggregatorState[roomId][aggregator.id] = Object.assign({}, aggregator,{
				activePresserCount : aggregator.activePresserCount + (isPressing ? 1 : -1)
			});
			if (isPressing && userPressingAggregator[roomId][socketId] !== aggregator.id){
				userPressingAggregator[socket.currentRoom][socketId] = aggregator.id;
			} else if (!isPressing && userPressingAggregator[roomId][socketId] === aggregator.id){
				userPressingAggregator[socket.currentRoom][socketId] = "";
			}
		}

		socket.on('aggregator:pressing:change',function(aggregatorId, isPressing){
			if (debug.events) console.log('aggregator:pressing:change')
			if (!aggregatorState[socket.currentRoom] || !aggregatorState[socket.currentRoom][aggregatorId]) return;
			if (!userPressingAggregator[socket.currentRoom]){ userPressingAggregator[socket.currentRoom] = {}; }

			var storedAggregator = aggregatorState[socket.currentRoom][aggregatorId];
			if (storedAggregator.state === 'aggregating' || storedAggregator.state === 'initializing'){
				const userCurrentlyPressingId = userPressingAggregator[socket.currentRoom][socket.id];
				//if selecting a new aggregator and user is curently pressing another, deactivate it, only one at a time allowed
				if (isPressing && userCurrentlyPressingId && userCurrentlyPressingId !== aggregatorId){
					selectDeselectAggregator(socket.currentRoom, socket.id, false, userCurrentlyPressingId);
				}
				//if changing pressing state of the currently pressing agg, unpress it. shouldn't get here 
				//cause client should handle it but just in case it's being naughty
				if (userCurrentlyPressingId && userCurrentlyPressingId === aggregatorId){
					selectDeselectAggregator(socket.currentRoom, socket.id, false, userCurrentlyPressingId);	
				} else {
					selectDeselectAggregator(socket.currentRoom, socket.id, isPressing, aggregatorId);
				}
			}
		});

		//when a client disconnects, remove their nominations and aggregating support
		socket.on('disconnect', function () {
			if (!userPressingAggregator[socket.currentRoom]) return;
			if (!userPressingAggregator[socket.currentRoom][socket.id]) return;
			const currentPressingAggregator = aggregatorState[socket.currentRoom][userPressingAggregator[socket.currentRoom][socket.id]];
			if (!currentPressingAggregator) return;
			if (currentPressingAggregator.state === 'nominating'){
				unnominateAggregator(socket.currentRoom, socket.id, currentPressingAggregator.id);
			} else if (currentPressingAggregator.state === 'initializing' || currentPressingAggregator.state === 'aggregating'){
				selectDeselectAggregator(socket.currentRoom, socket.id, false, currentPressingAggregator.id);
			}
		});
	});
}

export default Aggregators