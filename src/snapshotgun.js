import fs from 'fs';
import { join, basename, relative, isAbsolute } from 'path';
import generate from './generate';
import traverse from './traverse';
import { replaceSlashes } from './utils';

const isJsFile = file => /\.js$/.test(file);

const snapshotgun = (baseDir, options) => {
  const base = replaceSlashes(baseDir);

  const executeCandidates = [];
  const directories = [];

  fs.readdirSync(base).forEach(file => {
    const fullPath = replaceSlashes(join(base, file));
    if (!options.dir && fs.statSync(fullPath).isDirectory()) {
      directories.push(traverse(base, fullPath));
    } else if (!options.exec) {
      if (isJsFile(file)) {
        executeCandidates.push(file);
      }
    }
  });

  let exec;
  if (options.exec) {
    exec = replaceSlashes(options.exec);
    if (isAbsolute(exec)) {
      exec = relative(base, exec);
    }
  } else if (executeCandidates.length < 1) {
    throw Error('No suitable test execution files found');
  } else if (executeCandidates.length > 1) {
    throw Error(
      'Multiple candidates for test execution found: ' + executeCandidates
    );
  } else {
    exec = executeCandidates[0];
  }

  let dirs;
  if (options.dir) {
    let dirPath = replaceSlashes(options.dir);
    if (isAbsolute(dirPath)) { dirPath = relative(base, dirPath); }
    dirs = [traverse(base, join(base, dirPath))];
  } else if (!directories.length) {
    throw Error('No test file directories found.');
  } else {
    dirs = directories;
  }

  process.stdout.write('\n======= GENERATING TESTCASES =======\n');
  dirs.forEach(dir => generate(basename(base), dir, exec, base, options));
};

export default snapshotgun;
