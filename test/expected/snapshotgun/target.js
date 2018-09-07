import execute from './../valid/execute.js';
import input from './../snapshotgun/testcase/input.json';

const files = {
  input
};

it('testcase', () => {
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
