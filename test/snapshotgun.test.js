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
const expectedCommonJs = fs.readFileSync(
  join(dir, 'expected/snapshotgun_common_js.js'),
  'utf-8'
);
const testFilePath = join(
  dir,
  'data/snapshotgun/valid/testcase/testcase.test.js'
);
const commonJsPath = join(
  dir,
  'data/snapshotgun/common-js/testcase/testcase.test.js'
);
const definedExecFilePath = join(
  dir,
  'data/snapshotgun/no-candidates/testcase/testcase.test.js'
);
const definedDirPath = join(
  dir,
  'data/snapshotgun/defined-dir/defined-dir.test.js'
);

const cleanup = () => {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
  if (fs.existsSync(definedExecFilePath)) {
    fs.unlinkSync(definedExecFilePath);
  }
  if (fs.existsSync(definedDirPath)) {
    fs.unlinkSync(definedDirPath);
  }
  if (fs.existsSync(commonJsPath)) {
    fs.unlinkSync(commonJsPath);
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
    const path = join(dir, 'data/snapshotgun/already-exists');
    const testPath = join(path, 'testcase/testcase.test.js');
    fs.writeFileSync(testPath, 'already exists');
    snapshotgun(path, {});
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual('already exists');
    fs.unlinkSync(testPath);
  });

  it('overwrite', () => {
    const path = join(dir, 'data/snapshotgun/overwrite');
    const testPath = join(path, 'testcase/testcase.test.js');
    fs.writeFileSync(testPath, 'nothing here');
    snapshotgun(path, { overwrite: true });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(expectedBasic);
    fs.unlinkSync(testPath);
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
    snapshotgun(join(dir, 'data/snapshotgun/no-test-directories'), {
      dir: '../defined-dir'
    });
    expect(fs.existsSync(definedDirPath)).toBeTruthy();
    expect(fs.readFileSync(definedDirPath, 'utf-8')).toEqual(
      expectedDefinedDir
    );
  });

  it('common js', () => {
    snapshotgun(join(dir, 'data/snapshotgun/common-js'), {
      format: 'cjs'
    });
    expect(fs.existsSync(commonJsPath)).toBeTruthy();
    expect(fs.readFileSync(commonJsPath, 'utf-8')).toEqual(expectedCommonJs);
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

  afterAll(() => {
    cleanup();
  });
});
