import fs from 'fs';
import snapshotgun from '../src/snapshotgun';
import { dirname, join, basename } from 'path';

const dir = dirname(module.filename);

const expected = name =>
  fs.readFileSync(join(dir, 'expected/snapshotgun', name), 'utf-8');

const clean = path => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

describe('test snapshotgun', () => {
  it('basic', () => {
    const dirPath = join(dir, 'data/snapshotgun/valid');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    clean(testPath);
    snapshotgun(dirPath, {});
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(expected('basic.js'));
    clean(testPath);
  });

  it('verbose dry-run basic', () => {
    const dirPath = join(dir, 'data/snapshotgun/valid');
    snapshotgun(dirPath, { verbose: true, 'dry-run': true });
  });

  it('verbose dry-run skip', () => {
    const dirPath = join(dir, 'data/snapshotgun/already-exists');
    snapshotgun(dirPath, { verbose: true, 'dry-run': true });
  });

  it('verbose dry-run overwrite', () => {
    const dirPath = join(dir, 'data/snapshotgun/already-exists');
    snapshotgun(dirPath, { overwrite: true, verbose: true, 'dry-run': true });
  });

  it('already exists', () => {
    const dirPath = join(dir, 'data/snapshotgun/already-exists');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    snapshotgun(dirPath, {});
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      "console.log('already-exists');\n"
    );
  });

  it('overwrite', () => {
    const dirPath = join(dir, 'data/snapshotgun/overwrite');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    fs.writeFileSync(testPath, 'nothing here');
    snapshotgun(dirPath, { overwrite: true });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(expected('basic.js'));
    fs.unlinkSync(testPath);
  });

  it('defined execute relative path', () => {
    const dirPath = join(dir, 'data/snapshotgun/defined-exec');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    clean(testPath);
    snapshotgun(dirPath, {
      exec: '../valid/execute.js'
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('defined_exec.js')
    );
    clean(testPath);
  });

  it('defined execute absolute path', () => {
    const dirPath = join(dir, 'data/snapshotgun/defined-exec-abs');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    clean(testPath);
    snapshotgun(join(dirPath), {
      exec: join(dirname(module.filename), 'data/snapshotgun/valid/execute.js')
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('defined_exec_abs.js')
    );
    clean(testPath);
  });

  it('defined directory relative path', () => {
    const testPath = join(
      dir,
      'data/snapshotgun/defined-dir/defined-dir.test.js'
    );
    clean(testPath);
    snapshotgun(join(dir, 'data/snapshotgun/no-test-directories'), {
      dir: '../defined-dir'
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('defined_dir.js')
    );
    clean(testPath);
  });

  it('defined directory absolute path', () => {
    const dirPath = join(dir, 'data/snapshotgun/defined-dir-abs');
    const testPath = join(dirPath, 'defined-dir-abs.test.js');
    clean(testPath);

    snapshotgun(join(dir, 'data/snapshotgun/no-test-directories'), {
      dir: dirPath
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('defined_dir_abs.js')
    );

    clean(testPath);
  });

  it('defined target relative path', () => {
    const dirPath = join(dir, 'data/snapshotgun/valid');
    const testPath = join(dir, 'data/snapshotgun/target/testcase.test.js');
    clean(testPath);
    snapshotgun(dirPath, {
      target: '../target'
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(expected('target.js'));
    clean(testPath);
  });

  it('defined target absolute path', () => {
    const dirPath = join(dir, 'data/snapshotgun/valid');
    const testPath = join(dir, 'data/snapshotgun/target/testcase.test.js');
    clean(testPath);
    snapshotgun(dirPath, {
      target: join(dirname(module.filename), 'data/snapshotgun/target')
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(expected('target.js'));
    clean(testPath);
  });

  it('multiple files', () => {
    const dirPath = join(dir, 'data/snapshotgun/multiple-files');
    const testPath = join(dirPath, 'testcase/testdir/testdir.test.js');
    clean(testPath);
    snapshotgun(dirPath, {});
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('multiple_files.js')
    );
    clean(testPath);
  });

  it('multi', () => {
    const dirPath = join(dir, 'data/snapshotgun/multi');
    const testPath = join(dirPath, 'testcase/multifiles');

    const testFiles = [
      join(testPath, 'first.test.js'),
      join(testPath, 'second.test.js'),
      join(testPath, 'third.test.js')
    ];

    testFiles.forEach(f => clean(f));

    snapshotgun(dirPath, {
      mode: 'multi'
    });

    testFiles.forEach(f => expect(fs.existsSync(f)).toBeTruthy());
    testFiles.forEach(f =>
      expect(fs.readFileSync(f, 'utf-8')).toEqual(
        expected(
          'multi/' + basename(f).substring(0, basename(f).indexOf('.')) + '.js'
        )
      )
    );
    testFiles.forEach(f => clean(f));
  });

  it('multiple test directories', () => {
    const dirPath = join(dir, 'data/snapshotgun/multiple-test-directories');

    const testFiles = [
      join(dirPath, 'first/first.test.js'),
      join(dirPath, 'second/second.test.js'),
      join(dirPath, 'third/third.test.js')
    ];

    testFiles.forEach(f => clean(f));

    snapshotgun(dirPath, {});

    testFiles.forEach(f => expect(fs.existsSync(f)).toBeTruthy());
    testFiles.forEach(f =>
      expect(fs.readFileSync(f, 'utf-8')).toEqual(
        expected(
          'multidir/' +
            basename(f).substring(0, basename(f).indexOf('.')) +
            '.js'
        )
      )
    );
    testFiles.forEach(f => clean(f));
  });

  it('common js', () => {
    const dirPath = join(dir, 'data/snapshotgun/common-js');
    const testPath = join(dirPath, 'testcase/testcase.test.js');
    clean(testPath);
    snapshotgun(dirPath, {
      format: 'cjs'
    });
    expect(fs.existsSync(testPath)).toBeTruthy();
    expect(fs.readFileSync(testPath, 'utf-8')).toEqual(
      expected('common_js.js')
    );
    clean(testPath);
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
});
