import execute from './../../execute.js';
import mainFile from './third.json';
import extrafile from './../extrafile.json';

const files = {
  extrafile
};

it('third', () => {
  try {
    expect(execute(mainFile, files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
