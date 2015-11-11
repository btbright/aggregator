import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import TwitchEmbed from './TwitchEmbed.jsx'
import * as TwitchActions from '../actions/twitch'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Twitch extends Component {
	constructor(props){
		super(props)
		this.handleViewerCountUpdated = this.handleViewerCountUpdated.bind(this)
		this.buildTwitch = this.buildTwitch.bind(this)
		this.actions = bindActionCreators(TwitchActions, this.props.dispatch);
	}
	handleViewerCountUpdated(count){
		this.actions.updateViewerCount(count);
	}
	buildTwitch(){
		let viewerCount;
		if (this.props.channelViewerCount){
			viewerCount = <span className="viewerCount meta-info">{this.props.channelViewerCount} twitch viewers</span>
		}
		var userCount;
		if (this.props.userCount){
			userCount = <span className="user-count meta-info">{this.props.userCount} players</span>
		}
		var clickers;
		if (this.props.clickers){
			clickers = <span className="user-count meta-info">~{this.props.clickers} active players</span>
		}

		return (
			<div className="twitch clearfix">
				<span className="channel-name">{this.props.channel}</span>
				<div className="meta-wrap">
					<div className="game-meta">
						{userCount}
						{clickers}
					</div>
					<div className="twitch-meta">
						{viewerCount}
					</div>
				</div>
				<TwitchEmbed channel={this.props.channel} onViewerCountUpdated={this.handleViewerCountUpdated} />
			</div>
			)
	}
	render(){
		return this.props.shouldTwitch ? this.buildTwitch() : null
	} 
}

function mapStateToProps(state){
	return {
		shouldTwitch : state.room.twitch,
		channel : state.room.twitchChannel,
		channelViewerCount : state.room.twitchChannelViewerCount,
    	clickers : state.room.activeClickerCount,
    	userCount: state.room.userCount
	}
}

export default connect(mapStateToProps)(Twitch);