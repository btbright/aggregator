jest.dontMock('../components/AggregatorBar.jsx');
jest.mock('../components/AggregatorBarText.jsx');

describe('AggregatorBar', function() {
  it('has the correct elements', function() {
    
    var React = require('react/addons');
    var AggregatorBar = require('../components/AggregatorBar.jsx');
    var AggregatorBarText = require('../components/AggregatorBarText.jsx');
    var TestUtils = React.addons.TestUtils;

    var testText = "testing text";
    var testResidueColor = "bar-residue-green";
    console.log(AggregatorBar);
    var fullAggregatorBar = TestUtils.renderIntoDocument(
      <AggregatorBar 
        rightText={testText} 
        leftText={testText}
        barValue={30}
        residueValue={50}
        residueColorClass={testResidueColor} />
    );
    //console.log(fullAggregatorBar);
    expect(AggregatorBarText).toBeCalled();
  });
});