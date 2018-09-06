import execute from './../../valid/execute.js';
import input from './input.json';

it('testcase', () => {
  const files = {
    input
  };
  expect(execute(files)).toMatchSnapshot();
});
