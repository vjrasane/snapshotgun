import relative from '../src/relative';

describe('test relative paths', () => {
  it('absolute under dir', () => {
    expect(
      relative('C:/source/directory/path', 'C:/source/directory/path/to/target')
    ).toEqual('to/target');
  });

  it('absolute above dir', () => {
    expect(
      relative(
        'C:/source/directory/path/bit/further',
        'C:/source/directory/path'
      )
    ).toEqual('../../../path');
  });

  it('absolute above dir trailing slash', () => {
    expect(
      relative(
        'C:/source/directory/path/bit/further',
        'C:/source/directory/path/'
      )
    ).toEqual('../../');
  });

  it('absolute side dir', () => {
    expect(
      relative(
        'C:/source/directory/path',
        'C:/target/directory/path'
      )
    ).toEqual('../../../target/directory/path');
  });

  it('relative under dir', () => {
    expect(
      relative('source/directory/path', 'source/directory/path/to/target')
    ).toEqual('to/target');
  });

  it('relative above dir', () => {
    expect(
      relative(
        'source/directory/path/bit/further',
        'source/directory/path'
      )
    ).toEqual('../../../path');
  });

  it('relative above dir trailing slash', () => {
    expect(
      relative(
        'source/directory/path/bit/further',
        'source/directory/path/'
      )
    ).toEqual('../../');
  });

  it('relative side dir', () => {
    expect(
      relative(
        'source/directory/path',
        'target/directory/path'
      )
    ).toEqual('../../../target/directory/path');
  });

  it('relative backwards', () => {
    expect(
      relative(
        'source/directory/path',
        '../'
      )
    ).toEqual('../../../../');
  });
});
