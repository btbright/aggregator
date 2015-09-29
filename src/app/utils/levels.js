export const levelColors = {
	1 : "blue",
	2 : "green",
	3 : "gold"
}

export function getLevel(x){
	if (x < 40){
		return 1;
	}
	if (x < 70){
		return 2;
	}
	return 3;
}