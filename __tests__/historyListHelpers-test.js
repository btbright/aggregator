jest.autoMockOff()
jest.dontMock('../common/utils/historyListHelpers')
jest.dontMock('immutable')

var historyListHelpers = require('../common/utils/historyListHelpers');
var Immutable = require('immutable');

describe('history list helpers', function(){

	it('exports', () => {
		expect(historyListHelpers).toBeDefined();
	});

	const normalList = Immutable.List([2000,1900,1800,1700,1600,1500,1400,1300,1200,1100,1000,900,800,700])

	it('can find the next history key index', () => {
		expect(historyListHelpers.findNextHistoryKeyIndex(normalList, 1550)).toBe(4);
		expect(historyListHelpers.findNextHistoryKeyIndex(normalList, 1500)).toBe(4);
		expect(historyListHelpers.findNextHistoryKeyIndex(normalList, 2100)).toBeUndefined();
		expect(historyListHelpers.findNextHistoryKeyIndex(normalList, 500)).toBe(13);
	})

	it('can find the next history key', () => {
		expect(historyListHelpers.findNextHistoryKey(normalList, 500)).toBe(700);
		expect(historyListHelpers.findNextHistoryKey(normalList, 1700)).toBe(1800);
		expect(historyListHelpers.findNextHistoryKey(normalList, 1750)).toBe(1800);
		expect(historyListHelpers.findNextHistoryKey(normalList, 2100)).toBeUndefined();
	})

	it('can find the previous history key index', () => {
		expect(historyListHelpers.findPreviousHistoryKeyIndex(normalList, 1550)).toBe(5);
		expect(historyListHelpers.findPreviousHistoryKeyIndex(normalList, 1500)).toBe(5);
		expect(historyListHelpers.findPreviousHistoryKeyIndex(normalList, 2100)).toBe(0);
		expect(historyListHelpers.findPreviousHistoryKeyIndex(normalList, 500)).toBeUndefined();
	})

	it('can find the previous history key', () => {
		expect(historyListHelpers.findPreviousHistoryKey(normalList, 1550)).toBe(1500);
		expect(historyListHelpers.findPreviousHistoryKey(normalList, 1500)).toBe(1500);
		expect(historyListHelpers.findPreviousHistoryKey(normalList, 2100)).toBe(2000);
		expect(historyListHelpers.findPreviousHistoryKey(normalList, 500)).toBeUndefined();
	})

	it('can find future keys', () => {
		expect(Immutable.is(historyListHelpers.getFutureKeys(normalList, 1850), Immutable.List([2000, 1900]))).toBe(true);
		expect(Immutable.is(historyListHelpers.getFutureKeys(normalList, 1800), Immutable.List([2000, 1900]))).toBe(true);
		expect(Immutable.is(historyListHelpers.getFutureKeys(normalList, 500), normalList)).toBe(true);
		expect(Immutable.is(historyListHelpers.getFutureKeys(normalList, 2200), Immutable.List())).toBe(true);
	})
})