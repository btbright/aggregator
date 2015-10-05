import * as AggregatorActions from '../../common/actions/aggregators'
import * as ChatActions from '../../common/actions/chat'
import * as UserActions from '../../common/actions/user'
import { bindActionCreators } from 'redux'
import shortid from 'shortid'
import { simulationData } from './simulationData'

const taskRunnerRate = 1000;

export default class ActivitySimulator {
	constructor(getState, dispatch){
		this.dispatch = dispatch;
		this.getState = getState;
		this.aggregatorActions = bindActionCreators(AggregatorActions, this.dispatch);
		this.chatActions = bindActionCreators(ChatActions, this.dispatch);
		this.userActions = bindActionCreators(UserActions, this.dispatch);
		this.actionInterval = false;

		this.taskRunner = this.taskRunner.bind(this)
		this.run = this.run.bind(this)
		this.stop = this.stop.bind(this)
		this.addComment = this.addComment.bind(this)
		this.clickComment = this.clickComment.bind(this)
		this.supportAggregator = this.supportAggregator.bind(this)
		this.clickAggy = this.clickAggy.bind(this)
		this.currentClickingAggregatorId = false;
		this.clickingHandle = false;

		var nameIndex = Math.floor(Math.random() * simulationData.names.length);
		this.fakeName = simulationData.names[nameIndex]+Math.floor(Math.random()*10)+1;
		this.userActions.updateUserName(this.fakeName);
	}
	taskRunner(){
		if (Math.random() > 0.9){
			this.addComment()
		}
		if (Math.random() > 0.95){
			this.clickComment()
		}
		if (Math.random() > 0.6){
			this.supportAggregator()
		}
	}
	run(){
		this.actionInterval = setInterval(this.taskRunner,taskRunnerRate);
	}
	stop(){
		clearInterval(this.actionInterval);
	}

	clickComment(){
		var currentTime = Date.now();
		var aggregators = this.getState().aggregators;
		var recentMessages = this.getState().chatMessages.filter(m => {
			return currentTime - m.time < 1000 * 20;
		});
		if (recentMessages.length > 0){
			var messageIndex = Math.floor(Math.random() * recentMessages.length);
			if (!aggregators.find(a => a.objectId === recentMessages[messageIndex].id)){
				this.aggregatorActions.newAggregator("message",recentMessages[messageIndex].id);
			}
		}
	}

	addComment(){
		var commentIndex = Math.floor(Math.random()*simulationData.debateComments.length);
		this.chatActions.newChatMessage(simulationData.debateComments[commentIndex], this.fakeName);
	}

	supportAggregator(){
		var currentTime = Date.now();
		var aggregators = this.getState().aggregators.filter(a => {
			return !a.isComplete;
		});
		if (aggregators.length > 0){
			var aggregatorIndex = Math.floor(Math.random() * aggregators.length);
			this.currentClickingAggregatorId = aggregators[aggregatorIndex].id;
			this.clickAggy(this.currentClickingAggregatorId)
		}
	}

	clickAggy(id){
		if (this.currentClickingAggregatorId !== id) return
		var aggregator = this.getState().aggregators.find(a => {
			return a.id === id;
		});
		if (!aggregator || aggregator.isComplete) return;
		this.aggregatorActions.newAggregatorClick(id);
		setTimeout(()=>{
			this.clickAggy(id)
		},210)
	}
}