var React = require('react');

var AggregatorBarText = React.createClass({
	propTypes: {
		position : React.PropTypes.string.isRequired,
		text : React.PropTypes.string.isRequired,
	},
	render: function(){
		return (
			<span className={this.props.position+"-text"}>{this.props.text}</span>
			);
	}
});

module.exports = AggregatorBarText;