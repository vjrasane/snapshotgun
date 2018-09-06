import fs from 'fs';
import snapshotgun from '../src/snapshotgun';
import { dirname, join } from 'path';

const dir = dirname(module.filename);

const expectedBasic = fs.readFileSync(
  join(dir, 'expected/snapshotgun_basic.js'),
  'utf-8'
);
const expectedDefinedExec = fs.readFileSync(
  join(dir, 'expected/snapshotgun_defined_exec.js'),
  'utf-8'
);
const expectedDefinedDir = fs.readFileSync(
  join(dir, 'expected/snapshotgun_defined_dir.js'),
  'utf-8'
);
const testFilePath = join(
  dir,
  'data/snapshotgun/valid/testcase/testcase.test.js'
);
const definedExecFilePath = join(
  dir,
  'data/snapshotgun/no-candidates/testcase/testcase.test.js'
);

const cleanup = () => {
  if (fs.existsSync(testFilePath)) {
    fs.unlink(testFilePath);
  }
  if (fs.existsSync(definedExecFilePath)) {
    fs.unlink(definedExecFilePath);
  }
};

describe('test snapshotgun', () => {
  beforeAll(() => {
    cleanup();
  });

  it('basic', () => {
    snapshotgun(join(dir, 'data/snapshotgun/valid'), {});
    expect(fs.existsSync(testFilePath)).toBeTruthy();
    expect(fs.readFileSync(testFilePath, 'utf-8')).toEqual(expectedBasic);
  });

  it('already exists', () => {
    fs.writeFileSync(testFilePath, 'already exists');
    snapshotgun(join(dir, 'data/snapshotgun/valid'), {});
    expect(fs.existsSync(testFilePath)).toBeTruthy();
    expect(fs.readFileSync(testFilePath, 'utf-8')).toEqual('already exists');
  });

  it('overwrite', () => {
    fs.writeFileSync(testFilePath, 'nothing here');
    snapshotgun(join(dir, 'data/snapshotgun/valid'), { overwrite: true });
    expect(fs.existsSync(testFilePath)).toBeTruthy();
    expect(fs.readFileSync(testFilePath, 'utf-8')).toEqual(expectedBasic);
  });

  it('defined execute', () => {
    snapshotgun(join(dir, 'data/snapshotgun/no-candidates'), {
      exec: '../valid/execute.js'
    });
    expect(fs.existsSync(definedExecFilePath)).toBeTruthy();
    expect(fs.readFileSync(definedExecFilePath, 'utf-8')).toEqual(
      expectedDefinedExec
    );
  });

  it('defined directory', () => {
    cleanup();
    snapshotgun(join(dir, 'data/snapshotgun/no-test-directories'), {
      dir: '../valid/testcase'
    });
    expect(fs.existsSync(testFilePath)).toBeTruthy();
    expect(fs.readFileSync(testFilePath, 'utf-8')).toEqual(expectedDefinedDir);
  });

  it('multiple candidates', () => {
    expect(() =>
      snapshotgun(join(dir, 'data/snapshotgun/multiple-candidates'), {})
    ).toThrow('Multiple candidates for test execution found');
  });

  it('no candidates', () => {
    expect(() =>
      snapshotgun(join(dir, 'data/snapshotgun/no-candidates'), {})
    ).toThrow('No suitable test execution files found');
  });

  it('no test directories', () => {
    expect(() =>
      snapshotgun(join(dir, 'data/snapshotgun/no-test-directories'), {})
    ).toThrow('No test file directories found.');
  });

  // afterAll(() => {
  //   cleanup();
  // });
});
