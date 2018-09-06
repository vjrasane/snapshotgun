import execute from './../no-test-directories/execute.js';
import input from './input.json';

it('defined-dir', () => {
  const files = {
    input
  };
  expect(execute(files)).toMatchSnapshot();
});
