import execute from './../../execute.js';
import mainFile from './second.json';
import extrafile from './../extrafile.json';

const files = {
  extrafile
};

it('second', () => {
  try {
    expect(execute(mainFile, files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
