import React, { Component, PropTypes } from 'react'
import AggregatorList from './AggregatorList.jsx'
import Chat from './Chat.jsx'


class App extends Component {
	constructor(props) {
      	super(props);
	}
	render(){
		return (
			<div className="app-wrap clearfix">
				<Chat />
				<AggregatorList />
			</div>
			)
	}
}

export default App;