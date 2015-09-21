var React = require('react');
var _ = require('lodash');
var AggregatorBarText = require('./AggregatorBarText.jsx');

var AggregatorBar = React.createClass({
	propTypes : {
		rightText: React.PropTypes.string,
		leftText: React.PropTypes.string,
		barValue: React.PropTypes.number.isRequired
	},
	getInitialState : function(){
		return {
			flashes : []
		};
	},
	flash: function(){
		var that = this;
		this.setState(function(previousState){
			previousState.flashes.push("flash:"+Date.now());
			return {
				flashes : previousState.flashes
			}
		});
		setTimeout(function(){
			that.setState({
				flashes : _.rest(that.state.flashes) //get array except oldest
			})
		},300);
	},
	render: function(){
		console.log(this.state);
		var rightText;
		if (this.props.rightText){
			rightText = <AggregatorBarText text={this.props.rightText} position='right' />;
		}

		var leftText;
		if (this.props.leftText){
			leftText = <AggregatorBarText text={this.props.leftText} position='left' />
		}

		var width = this.props.barValue;

		return (
			<div className="bar">
				<div className="bar-wrap">
					{this.state.flashes.map(function(flashKey){
						return <div key={flashKey} style={{width:width + '%',right:width + '%'}} className='bar-leader'></div>
					})}
					<div className="bar-inner" style={{width:width + '%'}}></div>
					{rightText}
					{leftText}
				</div> 
			</div>
			);
	}
});

module.exports = AggregatorBar;