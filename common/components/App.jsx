import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'
import RoomInfo from './RoomInfo.jsx'


class App extends Component {
	constructor(props) {
      	super(props);
	}
	render(){
		return (
			<div className="app-wrap clearfix">
				<RoomInfo />
				<div className="primary-content-wrap clearfix">
					<AggregatorList />
					<Chat />
				</div>
			</div>
			)
	}
}

export default App;