jest.dontMock('../components/AggregatorBarText.jsx');
describe('AggregatorBarText', function() {
  it('sets the correct properties', function() {
    var React = require('react/addons');
    var AggregatorBarText = require('../components/AggregatorBarText.jsx');
    var TestUtils = React.addons.TestUtils;

    var testText = "testing text";
    var testPosition = "right";

    var aggregatorBarText = TestUtils.renderIntoDocument(
      <AggregatorBarText position={testPosition} text={testText} />
    );

    var barText = TestUtils.findRenderedDOMComponentWithTag(aggregatorBarText, 'span');
    expect(React.findDOMNode(barText).textContent).toEqual(testText);
    expect(React.findDOMNode(barText).className).toEqual(testPosition+"-text");
  });
});