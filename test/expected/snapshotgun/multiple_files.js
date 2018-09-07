import execute from './../../execute.js';
import extra from './../extra.json';
import input from './input.json';
import more from './more.json';

const files = {
  extra,
  input,
  more
};

it('testdir', () => {
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
