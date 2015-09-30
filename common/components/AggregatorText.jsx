import React, { Component, PropTypes } from 'react'

class AggregatorText extends Component {
	render() {
	    return (
	    	<div className="text-display">
				<p>{this.props.displayText}</p>
			</div>
	    )
	}
}

AggregatorText.propTypes = {
	displayText : React.PropTypes.string.isRequired
}

export default AggregatorText