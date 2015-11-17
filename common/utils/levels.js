export const levelColors = {
	0 : "default",
	1 : "green",
	2 : "blue",
	3 : "purple",
	4 : "gold"
}

export function getLevel(x){
	if (x < 20){
		return 0;
	}
	if (x < 40){
		return 1;
	}
	if (x < 60){
		return 2;
	}
	if (x < 80){
		return 3;
	}
	if (x <= 100){
		return 4;
	}
	return;
}