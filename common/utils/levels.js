export const levelColors = {
	0 : "default",
	1 : "blue",
	2 : "green",
	3 : "gold"
}

export function getLevel(x){
	if (x < 30){
		return 0;
	}
	if (x < 60){
		return 1;
	}
	if (x < 90){
		return 2;
	}
	if (x <= 100){
		return 3;
	}
	return;
}