import execute from './../no-test-directories/execute.js';
import input from './input.json';

const files = {
  input
};

it('defined-dir', () => {
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
