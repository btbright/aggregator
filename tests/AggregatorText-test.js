jest.dontMock('../components/AggregatorText.jsx');
describe('AggregatorText', function() {
  it('sets the correct properties', function() {
    var React = require('react/addons');
    var AggregatorText = require('../components/AggregatorText.jsx');
    var TestUtils = React.addons.TestUtils;

    var testText = "testing text";

    var aggregatorText = TestUtils.renderIntoDocument(
      <AggregatorText displayText={testText} />
    );

    var aggregatorTextEl = TestUtils.findRenderedDOMComponentWithClass(aggregatorText, 'text-display');
    expect(React.findDOMNode(aggregatorTextEl).textContent).toEqual(testText);
  });
});