import _ from 'lodash'

export const ballisticsParameters = {
	THRUST_VELOCITY : 5,
	THRUST_TIME : 200, //ms
	MASS : 30,
	GRAVITY_ACCELERATION : -10,
	DRAG_CONSTANT : 5
}

export const maxX = 100
export const frameRate = 1/60
export const gravityVelocity = ballisticsParameters.GRAVITY_ACCELERATION*frameRate;


//takes an array of timestamps and returns 0-100 x position
//based on physics model at a specific time
export function scorer(clicks, time, frameRateNew, initialX, initialVelocity){
	if (!clicks || !Array.isArray(clicks)) throw new Error("Malformed 'clicks' array");
	//throw out clicks newer than t, they are in the future and don't count
	var filteredClicks = clicks.filter((click) => click <= time);
	var activeClickCount = activeClicks(filteredClicks, time).length;
	var scoreResults = generateScore(activeClickCount, frameRateNew, initialX, initialVelocity)
	return scoreResults;
}

export function generateScore(activeClickCount, frameRateNew, initialX = 0, initialVelocity = 15){
	//v = v + a * dt
	let velocity = initialVelocity + calculateVelocity(activeClickCount);
	//x = x + v * dt
	let x = initialX + velocity * 1/60;
	if (x <= 0){
		velocity = 0;
		x = 0;
	}
	if (x > 100){
		x = 100
	}
	return { x : x, velocity : velocity };
}

export function calculateVelocity(activeClickCount){
	//calc velocity vector
	var thrustDV = (activeClickCount * 5)/30;
	//var dragDV = -Math.abs(ballisticsParameters.DRAG_CONSTANT * currentVelocity); //only drag on way up to clear off quicker
	//calc velocity
	return thrustDV - 1/6;
};

export function calculateClickrateMulitplier(globalClicksPerMin){
	return (clickRateWeight + globalClicksPerMin) / clickRateWeight;
}

export function activeClicks(clicks, time){
	return clicks.filter(activeClickFilter);

	function activeClickFilter(click){
		return time-click <= .2;
	}
}