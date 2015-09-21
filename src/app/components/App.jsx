var React = require('react');
var AggregatorBar = require('./AggregatorBar.jsx');

var AggregatorApp = React.createClass({
	onTestFlash : function(){
		this.refs.aggregatorBar.flash();
	},
	render: function(){
		return (
			<div>
				<a onClick={this.onTestFlash} href='#'>testFlash</a>
				<AggregatorBar ref="aggregatorBar" barValue={40} rightText="9:33pm" />
			</div>
			);
	}
});

module.exports = AggregatorApp;