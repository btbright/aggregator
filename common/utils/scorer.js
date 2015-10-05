import _ from 'lodash'

export const ballisticsParameters = {
	THRUST_VELOCITY : 10,
	THRUST_TIME : 200, //ms
	MASS : 30,
	MIN_GRAVITY : 0.20
}

export const maxX = 100
export const frameRate = 1/60


//takes an array of timestamps and returns 0-100 x position
//based on physics model at a specific time
export function scorer(clicks, time, frameRateNew, initialX, initialVelocity, globalActivityModifier){
	if (!clicks || !Array.isArray(clicks)) throw new Error("Malformed 'clicks' array");
	//throw out clicks newer than t, they are in the future and don't count
	var filteredClicks = clicks.filter((click) => click <= time);
	var activeClickCount = activeClicks(filteredClicks, time).length;
	var actualModifier = globalActivityModifier === 0 ? 1 : globalActivityModifier;
	var scoreResults = generateScore(activeClickCount, frameRateNew, initialX, initialVelocity, actualModifier)
	return scoreResults;
}

export function generateScore(activeClickCount, frameRateNew, initialX = 0, initialVelocity = 15, globalActivityModifier = 1){
	//v = v + a * dt
	let velocity = initialVelocity + calculateVelocity(initialX, initialVelocity, activeClickCount, frameRateNew, globalActivityModifier);
	//x = x + v * dt
	let x = initialX + velocity * frameRateNew;
	if (x <= 0){
		velocity = 0;
		x = 0;
	}
	if (x > 100){
		x = 100
	}
	return { x : x, velocity : velocity };
}

export function calculateVelocity(x, currentVelocity, activeClickCount, frameRateNew, globalActivityModifier){
	var thrustVelocity = 1;
	//calc velocity vector
	var thrustDV = (activeClickCount * (thrustVelocity/globalActivityModifier));

	//calc velocity
	return thrustDV - (x < 20 ? ballisticsParameters.MIN_GRAVITY : (x/100)) * 100 * thrustVelocity * frameRateNew;
};

export function calculateClickrateMulitplier(globalClicksPerMin){
	return (clickRateWeight + globalClicksPerMin) / clickRateWeight;
}

export function activeClicks(clicks, time){
	return clicks.filter(activeClickFilter);

	function activeClickFilter(click){
		return time-click <= 200;
	}
}

//https://en.wikipedia.org/wiki/Logistic_function
function gentleSigmoidCurve(x, midX, maxVal){return maxVal/(1+Math.pow(Math.E,(-0.2*(x-midX))))}