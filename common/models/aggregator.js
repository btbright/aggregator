import shortid from 'shortid'
import { encodeUint8, encodeFloat32, decodeUint8, decodeFloat32 } from '../utils/otwTransportHelpers'

export function createAggregator(props){
	return {
		id: props.id || shortid.generate(),
		createdTime: props.createdTime || Date.now(),
		userName : props.userName,
		nominationsCount : props.nominationsCount || 1,
		nominators : [props.userName],
		objectType : props.objectType,
		objectId : props.objectId,
		objectUserName : props.objectUserName || '',
		maxValue : 0,
		x : 0,
		velocity : 0,
		lastStateChangeTime : 0,
		state : 'nominating',
		activePresserCount : 0,
		lastServerUpdate : 0,
		level : 0
	}
}

export const states = {
	'nominating' : 0,
	'initializing' : 1,
	'aggregating' : 2,
	'completed' : 3,
	'retired' : 4,
	'removed' : 5,
	'cancelled' : 6
}

export const statesLookup = [ 'nominating', 'initializing', 'aggregating', 'completed', 'retired', 'removed', 'cancelled' ];

export const updateMutations = [
				{name : 'x', isPrecise : true},
				{name : 'maxValue', isPrecise : true},
				{name : 'velocity', isPrecise : true},
				{name : 'state', isPrecise : false},
				{name : 'activePresserCount', isPrecise : false},
				{name : 'nominationsCount', isPrecise : false},
				{name : 'level', isPrecise : false}
				]

export const encodeUpdate = function( updates ) {
  var msg = '';
  for ( var i = 0; i < updates.length; ++i ) {
    var update = updates[i];
    msg += update.id+'!!!';
    for (var j=0; j < updateMutations.length; j++){
    	msg += updateMutations[j].isPrecise === true ? encodeFloat32(update.mutations[j]) : encodeUint8(update.mutations[j])
    }
    msg += '|||'
  }
  return msg;
};

export const decodeUpdate = function( str ) {
  var updates = [];
  var rawUpdates = str.split('|||');

  rawUpdates.forEach(rawUpdate => {
  	if (rawUpdate){
  		var charsRead = 0;
	  	const splitRaw = rawUpdate.split('!!!');
	  	const id = splitRaw[0];
	  	const rawEncoded = splitRaw[1];
	  	let mutations = {};

	  	for (var i=0; i < updateMutations.length; i++){
	  		let decodeFunction = updateMutations[i].isPrecise === true ? decodeFloat32 : decodeUint8;
	    	charsRead += decodeFunction( rawEncoded, charsRead, mutations, updateMutations[i].name );
	    };

	    updates.push({id, mutations})
  	}
  })  
  return updates;
};