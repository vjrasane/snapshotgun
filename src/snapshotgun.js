import fs from 'fs';
import { join, basename } from 'path';
import generate from './generate';
import traverse from './traverse';
import { getAnyField, replaceSlashes } from './utils';

const snapshotgun = (baseDir, options) => {
  const base = replaceSlashes(baseDir);

  const executeCandidates = [];
  const directories = [];

  const optExec = getAnyField(['exec', 'e'], options);
  const optDir = getAnyField(['dir', 'd'], options);

  fs.readdirSync(base).forEach(file => {
    const fullPath = replaceSlashes(join(base, file));
    if (!optDir && fs.statSync(fullPath).isDirectory()) {
      directories.push(traverse(base, fullPath));
    } else if (!optExec) {
      try {
        const code = module.require(fullPath);
        if (
          Object.keys(code).length === 1 &&
          typeof code[Object.keys(code)[0]] === 'function'
        ) {
          executeCandidates.push(file);
        }
      } catch (error) {
        // not importable code
      }
    }
  });

  let exec;
  if (optExec) {
    exec = optExec;
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
  if (optDir) {
    dirs = [traverse(base, join(base, optDir))];
  } else if (!directories.length) {
    throw Error('No test file directories found.');
  } else {
    dirs = directories;
  }

  dirs.forEach(dir => generate(basename(base), dir, exec, base, options));
};

export default snapshotgun;
