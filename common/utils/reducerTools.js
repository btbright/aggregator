export function newListWithReplacementFromSubreducer(state, action, reducer, actionIdField = "id") {
	return newListWithReplacement(state, action[actionIdField], (oldObject) => {
		return reducer(oldObject, action);
	});
}

export function newListWithReplacement(list, searchId, transform){
	var index = list.findIndex(m => m.id === searchId);
	if (index === -1) return list;
	return newListWithReplacementAtIndex(list, index, transform);
}

export function newListWithReplacementAtIndex(list, index, transform){
	return newListWithReplacementObjectAtIndex(list, index, transform(list[index]));
}

export function newListWithReplacementObjectAtIndex(list, index, newObject){
	return [
	  ...list.slice(0, index),
	  newObject,
	  ...list.slice(index + 1)
	];
}

//takes a transform function of the form:
//(oldObject) => { fieldToUpdate : newValue }
//-- it merges the returned object from the function with the old object as the replacement
export function newListWithReplacementFields(list, searchId, transform){
	return newListWithReplacement(list, searchId, (oldObject) => {
		return Object.assign({}, oldObject, transform(oldObject));
	});
}