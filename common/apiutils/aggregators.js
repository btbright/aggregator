import { bindActionCreators } from 'redux'
import * as AggregatorActions from '../actions/aggregators'

export function bindAggregatorListeners(dispatch){
	var actions = bindActionCreators(AggregatorActions, dispatch);
	var socket = io();
	socket.on('aggregator:accepted', actions.updateAggregatorId);
	socket.on('aggregator:new', actions.addAggregator);
}

export function submitAggregator(aggregator){
	io().emit('aggregator:new',aggregator);
}