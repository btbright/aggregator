import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

class InstructionsModal extends Component {
	render(){
		const classes = classnames('instructions-modal',{
			'instructions-modal-open' : this.props.isOpen
		});
		return (
			<div className={classes} onClick={this.props.onModalCloseClick}>
				<div className="modal-content">
					<div className="modal-close-button">&times;</div>
					<div className="instructions">
						<h1>Instructions, etc.</h1>
						<p>The goal of the game is to get as many points as you can by typing smart things with your fingers into chat and finding smart things other players typed then clicking on them. If most of the players click on your thing, you&rsquo;ll get a bunch of points. If only a few do, you won&rsquo;t get as many points.</p>
						<p>If you are the first person to click a thing in chat to make it active and then other people click it to support it, you&rsquo;ll get points for finding it. But, if you click a thing in chat and then no one else clicks it, you&rsquo;ll lose points. So, don&rsquo;t click bad things.</p>
						<p>When you click a thing that is already active, you are supporting it in its rise to gold glory, but you can only support one thing at a time. So, pick the best thing. When you are supporting something there will be a small dot to its left. The more people support a thing, the higher the bar will go.</p>
						<p>If you have the most points at the end of the game, that&rsquo;s good. You win.</p>
						<p>This is a testing release, so things may fall apart at any time. My humblest apologies if/when it does. Please let me know if you have any questions, suggestions, comments, diatribes, etc. I&rsquo;d love hear what you think: <a target='_blank' href='https://twitter.com/btbright'>@btbright</a></p>
						<p>Grey &lt; Blue &lt; Green &lt; Gold</p>
						<p>TL;DR - Be funny in chat. Click things you like. Points will flow.</p>
					</div>
				</div>
			</div>
			)
	}
}



export default InstructionsModal;