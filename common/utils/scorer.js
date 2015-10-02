import _ from 'lodash'

const ballisticsParameters = {
	THRUST_VELOCITY : 5,
	THRUST_TIME : 200, //ms
	MASS : 30,
	GRAVITY_ACCELERATION : -10,
	DRAG_CONSTANT : 5
}

const maxX = 100
const frameRate = 1/60
const gravityVelocity = ballisticsParameters.GRAVITY_ACCELERATION*frameRate;
const initialVelocity = 15
const clickRateWeight = 1000
var counter = 0;
var times = [];

//takes an array of timestamps and returns 0-100 x position
//based on physics model at a specific time
export default function(clicks, time, initialX, initialVelocity){
	var startTime = performance.now()
	if (!clicks || !Array.isArray(clicks)) throw new Error("Malformed 'clicks' array");
	//throw out clicks newer than t, they are in the future and don't count
	var filteredClicks = clicks.filter((click) => click <= time);
	var activeClickCount = activeClicks(filteredClicks, time).length;
	var scoreResults = generateScore(activeClickCount, initialX, initialVelocity)
	return scoreResults;
}

function generateScore(activeClickCount, initialX = 0, initialVelocity = 15){
	//v = v + a * dt
	let velocity = initialVelocity + calculateVelocity(activeClickCount);
	//x = x + v * dt
	let x = initialX + velocity * frameRate;
	if (x <= 0){
		velocity = 0;
		x = 0;
	}
	if (x > maxX){
		x = maxX
	}
	return { x, velocity };
}

const calculateVelocity = _.memoize(function (activeClickCount){
	//calc velocity vector
	var thrustDV = (activeClickCount * ballisticsParameters.THRUST_VELOCITY)/ballisticsParameters.MASS;
	//var dragDV = -Math.abs(ballisticsParameters.DRAG_CONSTANT * currentVelocity); //only drag on way up to clear off quicker
	//calc velocity
	return thrustDV + gravityVelocity;
});

function calculateClickrateMulitplier(globalClicksPerMin){
	return (clickRateWeight + globalClicksPerMin) / clickRateWeight;
}

function activeClicks(clicks, time){
	return clicks.filter((click) => Math.abs(time-click) <= ballisticsParameters.THRUST_TIME);
}