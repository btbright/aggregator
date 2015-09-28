import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'

let fakeState = {
	messages : {
		"message-1" : {
			id : "message-1",
			userName : "jlbcredit",
			displayText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			formattedTime : "9:35pm",
			hasUserClicked : false,
			isAggregated : false,
			clicks : 8,
			aggregationLevel : "blue"
		},
		"message-2" : {
			id : "message-2",
			userName : "turdferg",
			displayText : "Ipsum dolor sit lorem amet, consectetur elit adipiscing.",
			formattedTime : "9:36pm",
			hasUserClicked : false,
			isAggregated : true,
			clicks : 8,
			aggregationLevel : "blue"
		}
	}
}

class App extends Component {
	constructor(props) {
      	super(props);
		this.state = fakeState;
	}
	chatMessageClicked(e,rawId){
		var id = rawId.substr(rawId.indexOf("$")+1);
		var newMessages = this.state.messages;
		newMessages[id].hasUserClicked = !newMessages[id].hasUserClicked;
		this.setState(newMessages);
	}
	render(){
		return (
			<div className="app-wrap clearfix">
				<Chat chatMessageClicked={this.chatMessageClicked} messages={this.state.messages} />
				<AggregatorList />
			</div>
			)
	}
}

export default App