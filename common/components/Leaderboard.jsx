import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Leaderboard extends Component {
	render(){
		<div className="leaderboard">
			<table>
				<tbody>
					{this.props.scores.map(score => {
						<tr key={score.get('userName')}>
							<td className="userName">{score.get('userName')}</td>
							<td className="points">{score.get('points')}</td>
						</tr>
					})}
				</tbody>
			</table>
		</div>
	}
}

function mapStateToProps(state) {
  return { scores: state.scores };
}

export default connect(mapStateToProps)(Leaderboard);