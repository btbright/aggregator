import React, { Component, PropTypes } from 'react'
import RoomInfo from './RoomInfo.jsx'

class StandaloneMeta extends Component {
	render(){
		return (
			<div className="standalone-meta">
				<span className="room-name">#{this.props.roomName}</span>
				<RoomInfo />
			</div>
			)
	} 
}

export default StandaloneMeta;