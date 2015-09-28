import React, { Component, PropTypes } from 'react'
import Aggregator from './Aggregator.jsx'
import _ from 'lodash'

class AggregatorList extends Component {
	render(){
		return (
			<div className="aggregator-list">
				{this.props.aggregators.map(function(aggregatorData){
					return <Aggregator key={_.uniqueId("aggregator")} {...aggregatorData} />
				})}
			</div>
			)
	}
}

AggregatorList.defaultProps = {
	aggregators : [
		{
			displayText: "Lorem steven dolor sit amet, consectetur adipiscing elit.",
			barColor: "blue",
			barValue: 30,
			rightText: "9:32pm",
			residueValue: 80,
			residueColor: "green"
		},
		{
			displayText: "Another silly dolor sit amet, consectetur adipiscing elit.",
			barColor: "green",
			barValue: 50,
			rightText: "9:37pm",
			residueValue: 70,
			residueColor: "blue"
		}
	]
}

export default AggregatorList