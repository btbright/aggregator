import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { debounce } from 'lodash'

class TwitchEmbed extends Component {
	constructor(){
		super()
		this.state = {
			height: 0,
			width : 0
		}
		this.handleResize = this.handleResize.bind(this)
		this.setVideoSizeState = this.setVideoSizeState.bind(this)
	}
	shouldComponentUpdate(nextProps, nextState){
		return nextState.height !== this.state.height || nextState.width !== this.state.width;
	}
	handleResize(e) {
		this.setVideoSizeState()
	}
	setVideoSizeState(){
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		if (windowWidth < 1000){
			this.setState({
				width: windowWidth-24,
				height: Math.round((windowWidth-24)*9/16*10)/10
			});
		} else if (windowHeight < 1000) {
			this.setState({
				width: 976,
				height: 450
			});
		} else {
			this.setState({
				width: 976,
				height: 549
			});
		}
	}
	componentDidMount(){
		window.addEventListener('resize', this.handleResize);
		this.handleResize = debounce(this.handleResize, 200)
		this.setVideoSizeState()

		window.onTwitchPlayerEvent = data => {
          data.forEach(event => {
		        if (event.event == "viewerCount") {
		          if (this.props.onViewerCountUpdated){
		          	this.props.onViewerCountUpdated(event.data.count);
		          }
		        }
		      });
		  }

		swfobject.embedSWF("//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf", "twitch_embed_player", "100%", "100%", "0", null,
          { "eventsCallback":"onTwitchPlayerEvent",
            "embed":1,
            "channel":this.props.channel,
            "auto_play":"true"},
          { "allowScriptAccess":"always",
            "allowFullScreen":"false"});

	}
	componentWillUnmount(){
		window.removeEventListener('resize', this.handleResize);
	}
	render(){
		return (
			<div className="twitch-embed" style={{width:this.state.width, height:this.state.height}}>
				<div id='twitch_embed_player'></div>
			</div>
			)
	} 
}

TwitchEmbed.propTypes = {
	channel : PropTypes.string.isRequired,
	onViewerCountUpdated : PropTypes.func
}

export default TwitchEmbed;