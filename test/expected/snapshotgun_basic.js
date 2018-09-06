import execute from './../execute.js';
import input from './input.json';

it('testcase', () => {
  const files = {
    input
  };
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
