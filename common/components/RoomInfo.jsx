import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { requestUpdateRoom } from '../actions/room'

class RoomInfo extends Component {
	constructor(props){
		super(props)
		this.props.dispatch(requestUpdateRoom(this.props.name))
	}
	render(){
		var userName;
		if (this.props.userName){
			var score;
			var ownScore = this.props.scores.find(s => s.get('userName') === this.props.userName);
			if (ownScore && ownScore.get('points') !== 0){
				score = <span className="user-score"> ({ownScore.get('points')})</span>
			}
			userName = <span className="user-count">{this.props.userName}{score}</span>
		}
		var userCount;
		if (this.props.userCount){
			userCount = <span className="user-count">{this.props.userCount} users</span>
		}
		var clickers;
		if (this.props.clickers){
			clickers = <span className="user-count">~{this.props.clickers} active clickers</span>
		}
		return (
			<div className="room-info">
				<span className="room-name">#{this.props.name}</span>
				<div className="left-info">
					{userName}
					{userCount}
					{clickers}
				</div>
			</div>
			);
	}
}

function mapStateToProps(state) {
  return {
    userCount: state.room.userCount,
    name: state.room.name,
    userName : state.user.userName,
    clickers : state.room.activeClickerCount,
    scores : state.scores
  };
}

export default connect(mapStateToProps)(RoomInfo);