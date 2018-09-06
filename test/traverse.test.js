import traverse from '../src/traverse';
import { dirname, join } from 'path';

import expectedBasic from './expected/traverse_basic';

const dir = dirname(module.filename);

describe('test directory traversal', () => {
  it('basic', () => {
    expect(traverse(dir, join(dir, 'data/traversal'))).toEqual(expectedBasic);
  });
});
