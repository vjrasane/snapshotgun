import execute from './../../execute.js';
import mainFile from './first.json';
import extrafile from './../extrafile.json';

const files = {
  extrafile
};

it('first', () => {
  try {
    expect(execute(mainFile, files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
