jest.autoMockOff()
jest.dontMock('../common/middleware/timeScrubber')
jest.dontMock('immutable')
jest.dontMock('redux')
var timeScrubber = require('../common/middleware/timeScrubber');
var Immutable = require('immutable');
var Redux = require('redux');
var constants = require('../common/constants/ActionTypes')

describe('timeScrubber',()=>{
	const createFakeStore = (fakeData, dispatchCB) => ({
	  getState() {
	    return fakeData;
	  },
	  dispatch(action) {
	  	dispatchCB(action)
	  	return;
	  }
	});

	const dispatchWithStoreOf = (storeData, action) => {
	  let nexted = undefined;
	  let dispatched = [];
	  const dispatch = timeScrubber()(createFakeStore(storeData, dispatchAttempt => dispatched.push(dispatchAttempt)))(actionAttempt => nexted = actionAttempt);
	  dispatch(action);
	  return [nexted, dispatched];
	};

	it('should dispatch actions it doesn\'t care about', () => {
		const action = {
	      type: "SIMPLE_STRING_UPDATE"
	    };
	    let [nexted, dispatched] = dispatchWithStoreOf({}, action)
		expect(nexted).toEqual(action);
	});

	it('should intercept MOVE_TO_TIME action', () => {
		const action = {
	      type: constants.MOVE_TO_TIME,
	      time : 1444334982589
	    };
		const fakeData = {
			time : Immutable.Map({
				currentTime : 1444334982586
			}),
			fakeReducer : Immutable.Map({
				isScrubbable : true,
				present : Immutable.Map(),
				updates : Immutable.List()
			}),
			anotherFakeReducer : Immutable.Map({
				isScrubbable : false,
				present : Immutable.Map(),
				updates : Immutable.List()
			})
		}
		let [nexted, dispatched] = dispatchWithStoreOf(fakeData, action)
		expect(nexted).toBeUndefined();
	});

	const addFakeReducerAction = {
		type : "ADD_FAKEREDUCER",
		keyField : "id",
		key : 25235231,
		object : {
			id : 25235231,
			createdTime : 1444178040462,
			text : "this is an example",
			type : "warning",
			timeToShow : 4000
		}
	};
	const removeFakeReducerAction = {
		type : "REMOVE_FAKEREDUCER",
		keyField : "id",
		key : 25235232,
		object : {
			id : 25235232,
			createdTime : 1444178040462,
			text : "this is an example",
			type : "warning",
			timeToShow : 4000
		}
	};
	const updateFakeReducerAction = {
		type : "UPDATE_FAKEREDUCER",
		keyField : "id",
		key : 25235233,
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
				replaced : ["aggregating"]
			}
		]
	};

	const fakeData = {
		time : Immutable.Map({
			currentTime : 1444334982586
		}),
		fakeReducer : Immutable.Map({
			isScrubbable : true,
			present : Immutable.Map(),
			updates : Immutable.fromJS({
				1444334982587 : [
					addFakeReducerAction,
					removeFakeReducerAction,
					updateFakeReducerAction
				],
				1444334982582 : [
					addFakeReducerAction,
					removeFakeReducerAction,
					updateFakeReducerAction
				]
			})
		}),
		anotherFakeReducer : Immutable.Map({
			isScrubbable : false,
			present : Immutable.Map(),
			updates : Immutable.List()
		})
	}

	describe('dispatch functionality', () => {

		describe('forward', () => {
			const action = {
		      type: constants.MOVE_TO_TIME,
		      time : 1444334982589
		    };
			let [nexted, dispatched] = dispatchWithStoreOf(fakeData, action)

			it('should dispatch an ADD action', () => {
				expect(dispatched[0]).toEqual(addFakeReducerAction);
			});

			it('should dispatch an REMOVE action', () => {
				expect(dispatched[1]).toEqual(removeFakeReducerAction);
			});

			it('should dispatch an UPDATE action', () => {
				expect(dispatched[2]).toEqual(updateFakeReducerAction);
			});
		})

		describe('backwards', () => {
			const action = {
		      type: constants.MOVE_TO_TIME,
		      time : 1444334982580
		    };
			let [nexted, dispatched] = dispatchWithStoreOf(fakeData, action)

			it('should dispatch an ADD action', () => {
				const reversedAddAction = {
					type : "REMOVE_FAKEREDUCER",
					keyField : "id",
					key : 25235231,
					object : {
						id : 25235231,
						createdTime : 1444178040462,
						text : "this is an example",
						type : "warning",
						timeToShow : 4000
					}
				};
				expect(dispatched[0]).toEqual(reversedAddAction);
			});
			it('should dispatch an REMOVE action', () => {
				const reversedRemoveAction = {
					type : "ADD_FAKEREDUCER",
					keyField : "id",
					key : 25235232,
					object : {
						id : 25235232,
						createdTime : 1444178040462,
						text : "this is an example",
						type : "warning",
						timeToShow : 4000
					}
				};

				expect(dispatched[1]).toEqual(reversedRemoveAction);
			});

			it('should dispatch an UPDATE action', () => {
				const reversedUpdateAction = {
					type : "UPDATE_FAKEREDUCER",
					keyField : "id",
					key : 25235233,
					mutations : [
						{
							type : "addition",
							property : "x",
							value : -.23
						},
						{
							type : "addition",
							property : "maxX",
							value : -.23
						},
						{
							type : "replacement",
							property : "state",
							value : "aggregating",
							replaced : []
						}
					]
				};

				expect(dispatched[2]).toEqual(reversedUpdateAction);
			});
		})
	})
});