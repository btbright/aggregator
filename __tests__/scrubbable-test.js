jest.autoMockOff()
jest.dontMock('../common/reducerEnhancers/scrubbable')
jest.dontMock('../common/constants/ActionTypes')
jest.dontMock('immutable')
var scrubbable = require('../common/reducerEnhancers/scrubbable');
var Immutable = require('immutable');
var actionTypes = require('../common/constants/ActionTypes');

/*

const addExample = {
		type : "ADD",
		keyField : "id",
		object : {
			id : 25235235,
			createdTime : 1444178040462,
			text : "this is an example",
			type : "warning",
			timeToShow : 4000
		}
	}

	const removeExample = {
		type : "REMOVE",
		keyField : "id",
		key : "Xkd2xV",
		//object generated at removetime so we can go back
		object : {
			id : "cvv2DAfasdf",
			text : "this is a chat message",
			userName : "ben",
			time : 1444178040462
		}
	}

	const updateExample = {
		type : 'UPDATE',
		keyField : "id",
		key : "Vej3xX"
		mutations : [
			{
				type : "addition",
				property : "x",
				value : .23
			},
			{
				type : "addition",
				property : "maxX",
				value : .23
			},
			{
				type : "replacement",
				property : "state",
				value : "complete",
				//generated at mutate time?
				replaced : "aggregating"
			}
		]
	};

*/

describe('scrubbable', () => {

	function reflector(state = Immutable.List(), action){
		return state;
	}

	const simpleReflector = scrubbable(reflector);

	const removeUpdate = {
		type : "REMOVE",
		keyField : "id",
		key : "Xkd2xV",
		//object generated at removetime so we can go back
		object : {
			id : "cvv2DAfasdf",
			text : "this is a chat message",
			userName : "ben",
			time : 1444178040462
		}
	}

	it('exports', () => {
		expect(scrubbable).toBeDefined();
	});

	it ('sets up the correct initial structure', () => {
		const simpleState = simpleReflector(undefined, {})

		expect(Immutable.is(simpleState.get('updates'), Immutable.Map())).toBeTruthy();
		expect(Immutable.List.isList(simpleState.get('present'))).toBeTruthy();
	});

	it('adds updates', () => {
		const updateAction = {
			type : actionTypes.ADD_UPDATE,
			namespace : 'reflector',
			time : 1444178040462,
			update : removeUpdate
		}

		var newState = simpleReflector(undefined, updateAction);
		expect(newState.get('updates').size).toBe(1);
		expect(Immutable.List.isList(newState.getIn(['updates',updateAction.time]))).toBeTruthy();
		expect(newState.getIn(['updates',updateAction.time]).size).toBe(1);
		expect(Immutable.Map.isMap(newState.getIn(['updates',updateAction.time]).first())).toBeTruthy();
		
		expect(newState.getIn(['updates',updateAction.time]).first().get('key')).toEqual(removeUpdate.key);
		expect(newState.getIn(['updates',updateAction.time]).first().getIn(['object','userName'])).toEqual(removeUpdate.object.userName);
	})

	it('doesnt add updates from the wrong namespace', () => {
		const updateActionWrongNamespace = {
			type : actionTypes.ADD_UPDATE,
			namespace : 'notReflector',
			time : 1444178040462,
			update : removeUpdate
		}

		var finalState = simpleReflector(undefined, updateActionWrongNamespace)
		expect(finalState.get('updates').size).toBe(0);
	})



	function simple(state = Immutable.List(), action){
		switch(action.type){
		case "ADD_SIMPLE":
			return state.push(Immutable.fromJS(action.entity))
		case "REMOVE_SIMPLE":
			return state.filter(item => item[action.keyField] !== action.key);
		case "UPDATE_SIMPLE":
			return Immutable.fromJS([{ id : 235235, x : 5.23, y : 9, state : "complete" }]);
		default:
			return state;
		}
	}
	const simpleReducer = scrubbable(simple);

	it('doesn\'t effect the enhanced reducer\'s output', () => {
		const updateAction = {
			type : "ADD_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235,
			entity : {
				id : 235235,
				testing : "oh hai"
			}
		}

		const initialState = Immutable.fromJS({present : [], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('present').size).toBe(1);
		expect(newState.get('present').first().get('testing')).toBe(updateAction.entity.testing);
	})

	it('updates an add update\'s information when run as action', () => {
		const updateAction = {
			type : "ADD_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235,
			entity : {
				id : 235235,
				testing : "oh hey"
			}
		}

		const initialState = Immutable.fromJS({present : [], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('updates').size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).first()).toBeDefined();
		expect(newState.getIn(['updates', updateAction.time.toString()]).first().get('key')).toBe(235235);
	})

	it('doesn\'t effect the enhanced reducer\'s output', () => {
		const updateAction = {
			type : "REMOVE_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235
		}

		const initialState = Immutable.fromJS({present : [{id : 235235, testing : "oh hai"}], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('present').size).toBe(1);
		expect(newState.get('present').first().get('testing')).toBe("oh hai");
	})

	it('updates a remove update\'s information when run as action', () => {
		const updateAction = {
			type : "REMOVE_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235
		}

		const initialState = Immutable.fromJS({present : [{id : 235235, testing : "oh hai"}], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('updates').size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).first()).toBeDefined();
		expect(newState.getIn(['updates', updateAction.time.toString()]).first().getIn(['entity','testing'])).toBe("oh hai");
	})

	it('doesn\'t effect the enhanced reducer\'s output', () => {
		const updateAction = {
			type : "UPDATE_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235,
			mutations : [
				{
					type : "addition",
					property : "x",
					value : .23
				},
				{
					type : "addition",
					property : "y",
					value : 2
				},
				{
					type : "replacement",
					property : "state",
					value : "complete"
				}
			]
		}

		const initialState = Immutable.fromJS({present : [{ id : 235235, x : 5, y : 7, state : "initializing" }], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('present').size).toBe(1);
		expect(newState.get('present').first().get('x')).toBe(5.23);
		expect(newState.get('present').first().get('y')).toBe(9);
		expect(newState.get('present').first().get('state')).toBe("complete");
	})

	it('adds needed mutation information to the update for reversing', () => {
		const updateAction = {
			type : "UPDATE_SIMPLE",
			time : 1444178040462,
			keyField : "id",
			key : 235235,
			mutations : [
				{
					type : "addition",
					property : "x",
					value : .23
				},
				{
					type : "addition",
					property : "y",
					value : 2
				},
				{
					type : "replacement",
					property : "state",
					value : "complete"
				}
			]
		}

		const initialState = Immutable.fromJS({present : [{ id : 235235, x : 5, y : 7, state : "initializing" }], updates : { 1444178040462 : [updateAction] }});

		var newState = simpleReducer(initialState, updateAction)
		expect(newState.get('updates').size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).size).toBe(1);
		expect(newState.getIn(['updates', updateAction.time.toString()]).first()).toBeDefined();
		expect(newState.getIn(['updates', updateAction.time.toString()]).first().getIn(['mutations',2,'replaced',0])).toBe("initializing");
	})

});    


























