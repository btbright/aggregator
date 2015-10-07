jest.autoMockOff()
jest.dontMock('../common/reducerEnhancers/deltable')
jest.dontMock('immutable')
var deltable = require('../common/reducerEnhancers/deltable');
var Immutable = require('immutable');

describe('deltable', () => {

	function reflector(state = Immutable.List(), action){
		return state;
	}

	const simpleReflector = deltable(reflector);

	it('exports', () => {
		expect(deltable).toBeDefined();
	});

	it('handles list adds', () => {
		const timeAdded = Date.now();
		const addExample = {
			type : "ADD_REFLECTOR",
			keyField : "createdTime",
			entity : {
				createdTime : timeAdded,
				text : "this is an example"
			}
		}

		var newState = simpleReflector(undefined, addExample);
		expect(newState.size).toBe(1);
		expect(newState.first().get('createdTime')).toBe(timeAdded)
	})

	it('handles map adds', () => {
		const timeAdded = Date.now();
		const addExample = {
			type : "ADD_REFLECTOR",
			key : timeAdded,
			entity : {
				createdTime : timeAdded,
				text : "this is an example"
			}
		}

		var newState = simpleReflector(Immutable.Map(), addExample);
		expect(newState.size).toBe(1);
		expect(newState.getIn([timeAdded.toString(),'text'])).toBe(addExample.entity.text)
	})

	it('it doesnt add from incorrect namespaces', () => {
		const timeAdded = Date.now();
		const addExample = {
			type : "ADD_NOTREFLECTOR",
			entity : {
				createdTime : timeAdded,
				text : "this is an example"
			}
		}

		var newState = simpleReflector(undefined, addExample);
		expect(newState.size).toBe(0);
	})

	it('it removes from a map', () => {
		const timeAdded = Date.now();
		const existingObject = {
			createdTime : timeAdded,
			text : "this is an example"
		}
		const removeExample = {
			type : "REMOVE_REFLECTOR",
			key : timeAdded
		}

		var stateToPass = {};
		stateToPass[timeAdded] = existingObject;

		var addedState = simpleReflector(Immutable.fromJS(stateToPass), {});
		expect(addedState.size).toBe(1);

		var removedState = simpleReflector(addedState, removeExample);
		expect(removedState.size).toBe(0);
	})

	it('it removes from a list', () => {
		const timeAdded = Date.now();
		const existingObject = {
			createdTime : timeAdded,
			text : "this is an example"
		}
		const anotherObject = {
			createdTime : timeAdded + 10,
			text : "this is an another example"	
		}
		const removeExample = {
			type : "REMOVE_REFLECTOR",
			keyField : "createdTime",
			key : timeAdded
		}

		var addedState = simpleReflector(Immutable.fromJS([existingObject, anotherObject]), {});
		expect(addedState.size).toBe(2);

		var removedState = simpleReflector(addedState, removeExample);
		expect(removedState.size).toBe(1);
	})

	it('it can update an object in a map', () => {
		const timeAdded = Date.now();
		const existingObject = {
			createdTime : timeAdded,
			text : "this is an example",
			x : 3,
			y : 4
		}
		const updateExample = {
			type : "UPDATE_REFLECTOR",
			key : timeAdded,
			mutations : [
				{
					type : "addition",
					property : "x",
					value : 2
				},
				{
					type : "addition",
					property : "y",
					value : -2
				},
				{
					type : "replacement",
					property : "text",
					value : "this is still an example"
				}
			]
		}

		var stateToPass = {};
		stateToPass[timeAdded] = existingObject;

		var newState = simpleReflector(Immutable.fromJS(stateToPass), updateExample);
		expect(newState.size).toBe(1);
		var updatedItem = newState.get(timeAdded.toString())
		expect(updatedItem).toBeDefined();
		expect(updatedItem.get('x')).toBe(5);
		expect(updatedItem.get('y')).toBe(2);
		expect(updatedItem.get('text')).toBe(updateExample.mutations[2].value);
	})

	it('it can update an object in a list', () => {
		const timeAdded = Date.now();
		const existingObject = {
			createdTime : timeAdded,
			text : "this is an example",
			x : 3,
			y : 4
		}
		const updateExample = {
			type : "UPDATE_REFLECTOR",
			keyField : "createdTime",
			key : timeAdded,
			mutations : [
				{
					type : "addition",
					property : "x",
					value : 2
				},
				{
					type : "addition",
					property : "y",
					value : -2
				},
				{
					type : "replacement",
					property : "text",
					value : "this is still an example"
				}
			]
		}

		var newState = simpleReflector(Immutable.fromJS([existingObject]), updateExample);
		expect(newState.size).toBe(1);
		var updatedItem = newState.first()
		expect(updatedItem).toBeDefined();
		expect(updatedItem.get('x')).toBe(5);
		expect(updatedItem.get('y')).toBe(2);
		expect(updatedItem.get('text')).toBe(updateExample.mutations[2].value);
	})
})