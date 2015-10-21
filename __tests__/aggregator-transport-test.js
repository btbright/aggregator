jest.autoMockOff()
jest.dontMock('../common/models/aggregator')
jest.dontMock('../common/utils/otwTransportHelpers')

var aggregatorModel = require('../common/models/aggregator');

describe('aggregator transport helpers', function(){

	it('exports', () => {
		expect(aggregatorModel).toBeDefined();
	});

	it('does stuff', () => {
		var updates = [
			{
				id : '2gwerhse5',
				mutations : [
					2.346346,
					2.346346,
					10.13,
					2,
					3,
					1
				]
			}
		]

		let encoded = aggregatorModel.encodeUpdate(updates);
		expect(encoded).toBeDefined();
		let decoded = aggregatorModel.decodeUpdate(encoded);
		expect(decoded[0].mutations.state).toBe(2);
	})
})