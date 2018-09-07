const execute = require('./../execute.js');
const input = require('./input.json');

const files = {
  input
};

it('testcase', function () {
  try {
    expect(execute.default(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
