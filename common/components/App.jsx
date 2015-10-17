import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'
import UpperNotificationBar from './UpperNotificationBar.jsx'
import Leaderboard from './Leaderboard.jsx'
import Twitch from './Twitch.jsx'
import StandaloneMeta from './StandaloneMeta.jsx'
import { connect } from 'react-redux'
import { requestUpdateRoom } from '../actions/room'
import classnames from 'classnames'

class App extends Component {
	constructor(props){
		super(props)
		this.props.dispatch(requestUpdateRoom(this.props.roomName))
	}
	render(){

		let header;

		if (this.props.shouldTwitch){
			header = (
						<div className="header">
							<Twitch /> 
							<Leaderboard shouldShowPosition={true} />
						</div>
					  );
		} else {
			header = (
					  <div className="header">
						  <Leaderboard />
					  	  <StandaloneMeta roomName={this.props.roomName} />
					  </div>
					  )
		}

		const classes = classnames('app-wrap','clearfix',{
			'app-twitch-embeded' : this.props.shouldTwitch
		});
		return (
			<div className={classes}>
				{header}
				<UpperNotificationBar />
				<div className="primary-content-wrap clearfix">
					<AggregatorList />
					<Chat />
				</div>
			</div>
			)
	}
}

function mapStateToProps(state){
	return {
		roomName : state.room.name,
		shouldTwitch : state.room.twitch
	}
}

export default connect(mapStateToProps)(App);