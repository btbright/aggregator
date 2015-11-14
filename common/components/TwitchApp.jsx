import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import PermagatorList from './PermagatorList.jsx'
import Chat from './Chat.jsx'
import UpperNotificationBar from './UpperNotificationBar.jsx'
import Leaderboard from './Leaderboard.jsx'
import Twitch from './Twitch.jsx'
import InstructionsModal from './InstructionsModal.jsx'
import { connect } from 'react-redux'
import { requestUpdateRoom } from '../actions/room'
import classnames from 'classnames'

class TwitchApp extends Component {
	constructor(props){
		super(props)
		this.props.dispatch(requestUpdateRoom(this.props.roomName))
		this.handleInstructionsLinkClick = this.handleInstructionsLinkClick.bind(this)
		this.handleModalCloseClick = this.handleModalCloseClick.bind(this)
		this.state = {
			areInstructionsShown : false
		}
	}
	handleInstructionsLinkClick(){
		this.setState({
			areInstructionsShown : true
		})
	}
	handleModalCloseClick(){
		this.setState({
			areInstructionsShown : false
		})	
	}
	render(){
		const classes = classnames('app-wrap','clearfix','app-twitch-embeded');
		return (
			<div className="outer-wrap">
				<div className={classes}>
					<div className="header">
						<Twitch /> 
						<Leaderboard shouldShowPosition={true} />
					</div>
					<UpperNotificationBar />
					<div className="primary-content-wrap clearfix">
						<div className="aggregators-wrap">
							<PermagatorList />
							<AggregatorList />
						</div>
						<Chat />
					</div>
					<InstructionsModal isOpen={this.state.areInstructionsShown} onModalCloseClick={this.handleModalCloseClick} />
					<span className="instructions-link" onClick={this.handleInstructionsLinkClick}>What is all this? I need an adult</span>
				</div>
			</div>

			)
	}
}

function mapStateToProps(state){
	return {
		roomName : state.room.name
	}
}

export default connect(mapStateToProps)(TwitchApp);