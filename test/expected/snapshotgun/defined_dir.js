import execute from './../no-test-directories/execute.js';
import input from './input.json';

it('defined-dir', () => {
  const files = {
    input
  };
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});