import * as types from '../constants/ActionTypes'
import * as notificationActions from './notifications'

export function updateUserName(userName){
	return {
		type: types.UPDATE_USER_NAME,
		userName
	}
}

export function removeUserName(){
	return {
		type : types.REMOVE_USER_NAME
	}
}

export function updateUserPoints(userName, points, newPoints){
	return function(dispatch, getState){

		dispatch({
			type : types.UPDATE_USER_POINTS,
			userName,
			points,
			isRemoteTriggered : true
		})

		if (getState().user.userName !== userName) return;

		const cornySayings = [
								'Gee willikers', 
								'Holy moly', 
								'Sweet sassy molassy', 
								'By golly', 
								'By george', 
								'Jumping Jehosaphat', 
								'Heavens to betsy',
								'Jiminy Cricket',
								'Great scott',
								'Crikey',
								'Jeepers creepers',
								'Jinkies'
							];

		const endings = [
							'Points are delicious.',
							'Look at you.',
							'Sweet, useless points.',
							'That\'s good. One less thing.',
							'What a success.',
							'Cool beans.',
							'Cool cool coolio.',
							'Tremendous.',
							'Cowabunga.'
						];

		const cornyIndex = Math.floor(Math.random()*cornySayings.length)
		const endingIndex = Math.floor(Math.random()*endings.length)

		dispatch(notificationActions.addNotification(`${cornySayings[cornyIndex]}, you got ${newPoints} points for doing something clever. ${endings[endingIndex]}`, "informational"))
	}
}