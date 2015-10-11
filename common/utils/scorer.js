const maxX = 100
const arbitraryBoost = 1.05;

export function scorer(activePresserCount, frameRate, initialX = 0, initialVelocity = 0, activeUsers = 1){
	//v = v + a * dt
	let velocity = initialVelocity + calculateAdditionalVelocity(initialX, initialVelocity > -20 ? activePresserCount : 0, frameRate, activeUsers === 0 ? 1 : activeUsers);
	//x = x + v * dt
	let x = initialX + velocity * frameRate;
	if (x <= 0){
		velocity = 0;
		x = 0;
	}
	if (x > maxX){
		x = maxX
	}
	return { x : x, velocity : velocity };
}

function calculateAdditionalVelocity(x, activePresserCount, frameRate, activeUsers){
	//normalize each user's vote to 1/activeUsers so if half vote, we end up half-way, plus a little
	var thrustDV = (activePresserCount / activeUsers) * arbitraryBoost;
	//                G
	return thrustDV - x * frameRate;
};