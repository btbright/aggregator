import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'
import RoomInfo from './RoomInfo.jsx'
import UpperNotificationBar from './UpperNotificationBar.jsx'


class App extends Component {
	constructor(props) {
      	super(props);
	}
	render(){
		return (
			<div className="app-wrap clearfix">
				<RoomInfo />
				<UpperNotificationBar />
				<div className="primary-content-wrap clearfix">
					<Chat />
				</div>
			</div>
			)
	}
}

export default App;