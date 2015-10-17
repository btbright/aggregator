import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

class Leaderboard extends Component {
	shouldComponentUpdate(nextProps){
		return this.props.scores !== nextProps.scores;
	}
	render(){
		return (
			<div className="leaderboard">
					<table>
						<tbody>
							{this.props.scores.map((score, index) => {
								const classNames = classnames('userName', score.get('userName') === this.props.userName ? 'isUser' : '')
								return (<tr key={score.get('userName')}>
											{this.props.shouldShowPosition ? (<td className="position">{index+1}. </td>) : null}
											<td className={classNames}>{score.get('userName')}</td>
											<td className="points">{score.get('points')}</td>
										</tr>)
							})}
						</tbody>
					</table>
				</div>
			)
	} 
}

Leaderboard.defaultProps = {
	shouldShowPosition : false
}

function mapStateToProps(state) {
  return { scores: state.scores.take(5), userName: state.user.userName };
}

export default connect(mapStateToProps)(Leaderboard);