import React, { Component, PropTypes } from 'react'

class AggregatorBarText extends Component {
	render() {
		return (
			<span className={this.props.position+"-text"}>{this.props.text}</span>
			)
	}
}

AggregatorBarText.propTypes = {
	position : React.PropTypes.string.isRequired,
	text : React.PropTypes.string.isRequired,
}

export default AggregatorBarText