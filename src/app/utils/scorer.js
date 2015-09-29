const ballisticsParameters = {
	THRUST_VELOCITY : 300,
	THRUST_TIME : .2, //ms
	MASS : 30,
	GRAVITY_ACCELERATION : -10,
	DRAG_CONSTANT : 5
}

const maxX = 100
const frameRate = 1/60
const initialVelocity = 15
const initialX = 0

//takes an array of timestamps and returns 0-100 x position
//based on physics model at a specific time
export default function(clicks, time){
	function calculateVelocity(activeClickCount){
		//calc accelerations
		var thrustDV = (activeClickCount * ballisticsParameters.THRUST_VELOCITY)/ballisticsParameters.MASS;
		var dragDV = -ballisticsParameters.DRAG_CONSTANT * currentVelocity;
		//calc velocity
		return (thrustDV + ballisticsParameters.GRAVITY_ACCELERATION)*frameRate;
	}

	function activeClicks(clicks,time){
		return clicks.filter((click) => Math.abs(time-click) <= ballisticsParameters.THRUST_TIME);
	}

	let t = (time || Date.now()) / 1000;
	let x = initialX;
	//if there aren't any clicks
	if (!clicks || !Array.isArray(clicks) || clicks.length === 0) return x;
	//throw out clicks newer than t, they are in the future and don't count
	var filteredClicks = clicks.map((click) => click / 1000).filter((click) => click <= t);
	//v = v + a * dt
	//x = x + v * dt
	var startTime = filteredClicks[0];
	var frames = Math.floor((t - startTime)/frameRate);
	let currentVelocity = initialVelocity;
	for (var i = 0; i < frames; i++) {
		var activeClickCount = activeClicks(filteredClicks,startTime+(i*frameRate)).length;
		currentVelocity = currentVelocity + calculateVelocity(activeClickCount);
		var dx = currentVelocity * frameRate;
		x = x + dx
		if (x <= 0){
			currentVelocity = 0;
			x = 0;
		}
		if (x > maxX){
			x = maxX
		}
	};
	return x;
}