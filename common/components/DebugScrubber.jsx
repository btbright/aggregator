import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import * as actions from '../actions/time'

class DebugScrubber extends Component {
	constructor(props){
		super(props)
		this.handlePlayClick = this.handlePlayClick.bind(this)
		this.handlePauseClick = this.handlePauseClick.bind(this)
		this.handleReverseClick = this.handleReverseClick.bind(this)
		this.handleJumpForward = this.handleJumpForward.bind(this)
		this.handleJumpBack = this.handleJumpBack.bind(this)
	}
	shouldComponentUpdate(nextProps){
		return this.props.currentTime !== nextProps.currentTime ||
			   this.props.averageLatency !== nextProps.averageLatency;
	}
	handlePlayClick(){
		this.props.dispatch(actions.playTime())
	}
	handlePauseClick(){
		this.props.dispatch(actions.pauseTime())
	}
	handleReverseClick(){
		this.props.dispatch(actions.reverseTime())
	}
	handleJumpBack(){
		this.props.dispatch(actions.moveToTime(this.props.currentTime - 100))
	}
	handleJumpForward(){
		this.props.dispatch(actions.moveToTime(this.props.currentTime + 100))
	}
	render(){
		return (
			<div onMouseDown={this.handlePauseClick} className="debugScrubber">
				<div className="currentTime">{this.props.currentTime}</div>
				<div className="timeControls">
					<span className="jumpBack" onClick={this.handleJumpBack}>&#9664;&#9664; </span>
					<span className="reverse" onClick={this.handleReverseClick}>&#9664;</span>
					<span className="pause" onClick={this.handlePauseClick}>&#9612;&#9612;</span>
					<span className="play" onClick={this.handlePlayClick}>&#9654;</span>
					<span className="jumpForward" onClick={this.handleJumpForward}> &#9654;&#9654;</span>
				</div>
			</div>
			)
	}
}

function mapStateToProps(state) {
  return { currentTime: state.time.get('currentTime'), averageLatency : state.time.get('currentTime') };
}

export default connect(mapStateToProps)(DebugScrubber);