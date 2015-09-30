import React, { Component, PropTypes } from 'react'

class AggregationSummary extends Component {
	constructor(props) {
      super(props);
      this.state = {
      	componentWidth : 0
      };
    }
	componentDidUpdate(){
		var newWidth = React.findDOMNode(this).offsetWidth;
		if (this.state.componentWidth != newWidth){
			this.setState({
				componentWidth : newWidth
			});
		}
	}
	render(){
		var styles = {right: this.props.shouldShow ? -this.state.componentWidth : -2};
		return (
			  <div style={styles} className="aggregation-summary">
			    <p>
			      <span className="count">{this.props.clicks}</span>
			      <span className="count-label">&#8694;</span>
			    </p>
			  </div>
			)
	}
}

AggregationSummary.propTypes = {
	clicks : PropTypes.number.isRequired,
	shouldShow : PropTypes.bool
}

export default AggregationSummary;