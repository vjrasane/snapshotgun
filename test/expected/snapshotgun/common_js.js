const execute = require('./../execute.js');
const input = require('./input.json');

it('testcase', function () {
  const files = {
    input
  };
  try {
    expect(execute.default(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
