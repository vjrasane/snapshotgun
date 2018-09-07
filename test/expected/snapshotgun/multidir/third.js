import execute from './../execute.js';
import input from './input.json';

const files = {
  input
};

it('third', () => {
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
