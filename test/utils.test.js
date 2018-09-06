import { prependMissing } from '../src/utils';

describe('test utils', () => {
  it('prependMissing already starts with', () => {
    expect(prependMissing('start/string', 'start')).toEqual('start/string');
  });
});
