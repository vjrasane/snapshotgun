import parseArgs from '../src/args';

describe('test argument parsed', () => {
  it('no args', () => {
    expect(parseArgs([])).toEqual({});
  });

  it('single boolean arg', () => {
    expect(parseArgs(['--bool'])).toEqual({ bool: true });
  });

  it('single value arg', () => {
    expect(parseArgs(['--key', 'value'])).toEqual({ key: 'value' });
  });

  it('multi value arg', () => {
    expect(parseArgs(['--key', 'first', 'second', 'third'])).toEqual({
      key: ['first', 'second', 'third']
    });
  });

  it('complex arguments', () => {
    expect(
      parseArgs([
        '--bool',
        '--value',
        'value',
        '--array',
        'first',
        'second',
        'third',
        '--other',
        '--second',
        'something'
      ])
    ).toEqual({
      array: ['first', 'second', 'third'],
      bool: true,
      other: true,
      second: 'something',
      value: 'value'
    });
  });

  it('aliases', () => {
    expect(
      parseArgs(['-v', 'value', '-b', '-k', 'first', 'second', 'third'])
    ).toEqual({ b: true, k: ['first', 'second', 'third'], v: 'value' });
  });

  it('missing arg', () => {
    expect(() => parseArgs(['value'])).toThrow('Missing argument for value');
  });

  it('arg name too short', () => {
    expect(() => parseArgs(['--v'])).toThrow('name too short');
  });

  it('missing arg name', () => {
    expect(() => parseArgs(['--'])).toThrow('Missing argument for value');
  });

  it('too many dashes', () => {
    expect(() => parseArgs(['----arg'])).toThrow('Missing argument for value');
  });

  it('alias name too long', () => {
    expect(() => parseArgs(['-value'])).toThrow(
      'must be exactly one character'
    );
  });

  it('missing alias name', () => {
    expect(() => parseArgs(['-'])).toThrow('Missing argument for value');
  });

  it('duplicate arguments', () => {
    expect(() => parseArgs(['--arg', 'value', '--arg', 'value'])).toThrow(
      'Duplicate argument'
    );
  });
});
