jest.autoMockOff()
jest.dontMock('../common/reducers/aggregatorListSlots')
jest.dontMock('immutable')

var aggregatorListSlots = require('../common/reducers/aggregatorListSlots');
var Immutable = require('immutable');

describe('aggregatorListSlots', function(){

	it('exports', () => {
		expect(aggregatorListSlots).toBeDefined();
	});

	const fakeState = Immutable.fromJS([
			{
				id : 'abcd',
				active : true,
				createdTime : 1000
			},
			{
				id : 'bcde',
				active : true,
				createdTime : 1100
			},
			{
				id : 'cdef',
				active : false,
				createdTime : 800
			},
			{
				id : 'defg',
				active : true,
				createdTime : 900
			}
		]);

	it('exports', () => {
		expect(aggregatorListSlots).toBeDefined();
	});

	it('can remove/inactivate slots', () => {
		const action = {
			type : 'UPDATE_AGGREGATORS',
			key : 'bcde',
			mutations : [{value : 'removed'}]
		};
		expect(aggregatorListSlots(fakeState, action).get(1).get('active')).toBe(false);

		const removeAction = {
			type : 'REMOVE_AGGREGATORS',
			key : 'defg'
		};
		expect(aggregatorListSlots(fakeState, removeAction).size).toBe(2);
	})

	it('can add slots', () => {
		const action = {
			type : 'ADD_AGGREGATORS',
			entity : {
				id : 'efgh',
				createdTime : 1200
			}
		};
		expect(aggregatorListSlots(fakeState, action).get(2).get('id')).toBe('efgh');

		const sameAction = {
			type : 'ADD_AGGREGATORS',
			entity : {
				id : 'abcd',
				createdTime : 1200
			}
		};
		expect(aggregatorListSlots(fakeState, sameAction).get(0).get('id')).toBe('abcd');
		expect(aggregatorListSlots(fakeState, sameAction).size).toBe(4);

		const addAction = {
			type : 'ADD_AGGREGATORS',
			entity : {
				id : 'efgh',
				createdTime : 1050
			}	
		}
		expect(aggregatorListSlots(fakeState, addAction).get(1).get('id')).toBe('efgh');
		expect(aggregatorListSlots(fakeState, addAction).get(2).get('id')).toBe('bcde');
	})

})