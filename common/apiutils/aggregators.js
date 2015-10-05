import { bindActionCreators } from 'redux'
import * as AggregatorActions from '../actions/aggregators'

export function bindAggregatorListeners(dispatch){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	var actions = bindActionCreators(AggregatorActions, dispatch);
	var socket = io();
	socket.on('aggregator:new', actions.addAggregator);
	socket.on('aggregator:click:new', function(id, click){
		actions.addClickToAggregator(id, Date.now())
	})
	socket.on('aggregators:update', actions.makeUpdateAggregatorsAction);
}

export function submitAggregator(aggregator){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit('aggregator:new',aggregator);
}

export function submitAggregatorClick(aggregatorId, click){
	if (typeof io === "undefined") return; //only bind listeners on client (better way to do this?)
	io().emit('aggregator:click:new',aggregatorId, click);
}