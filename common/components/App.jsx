import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'
import UpperNotificationBar from './UpperNotificationBar.jsx'
import Leaderboard from './Leaderboard.jsx'
import StandaloneMeta from './StandaloneMeta.jsx'
import InstructionsModal from './InstructionsModal.jsx'
import { connect } from 'react-redux'
import { requestUpdateRoom } from '../actions/room'
import classnames from 'classnames'

class App extends Component {
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
		const classes = classnames('app-wrap','clearfix');
		return (
			<div className="outer-wrap">
				<div className={classes}>
					<div className="header">
					  	  <div className="right-info">
						  	<Leaderboard />
					  	  </div>
					  	  <StandaloneMeta roomName={this.props.roomName} />
					  </div>
					<UpperNotificationBar />
					<div className="primary-content-wrap clearfix">
						<AggregatorList />
						<Chat />
					</div>
					<InstructionsModal isOpen={this.state.areInstructionsShown} onModalCloseClick={this.handleModalCloseClick} />
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

export default connect(mapStateToProps)(App);