
export function findNextHistoryKeyIndex(historyKeysList, time){
	if (historyKeysList.first() < time) return;
	const timeIndex = historyKeysList.indexOf(time);
	if (timeIndex !== -1) return timeIndex-1;
	const firstSmallerIndex = historyKeysList.findIndex(k => k < time);
	//return the index of the last element
	if (firstSmallerIndex === -1) return historyKeysList.size - 1;
	return firstSmallerIndex-1;
}

export function findNextHistoryKey(historyKeysList, time){
	return historyKeysList.get(findNextHistoryKeyIndex(historyKeysList, time))
}

export function getFutureKeys(historyKeysList, time){
	const nextHistoryIndex = findNextHistoryKeyIndex(historyKeysList, time);
	return historyKeysList.slice(0, nextHistoryIndex+1);
}

export function findPreviousHistoryKeyIndex(historyKeysList, time){
	if (historyKeysList.first() <= time) return 0;
	const timeIndex = historyKeysList.indexOf(time);
	if (timeIndex !== -1) return timeIndex;
	const firstSmallerIndex = historyKeysList.findIndex(k => k < time);
	if (firstSmallerIndex === -1) return;
	return firstSmallerIndex;
}

export function findPreviousHistoryKey(historyKeysList, time){
	return historyKeysList.get(findPreviousHistoryKeyIndex(historyKeysList, time))
}