import fs from 'fs';
import { join, basename, relative, isAbsolute } from 'path';
import generate from './generate';
import traverse from './traverse';
import chalk from 'chalk';
import { replaceSlashes } from './utils';

const isJsFile = file => /\.js$/.test(file);

const printStat = (stat, message, color) => {
  const clr = stat === 0 ? chalk.gray : color;
  process.stdout.write(clr(message + stat) + '\n');
};

const snapshotgun = (baseDir, options) => {
  const base = replaceSlashes(baseDir);

  const executeCandidates = [];
  let directories = {};

  fs.readdirSync(base).forEach(file => {
    const fullPath = replaceSlashes(join(base, file));
    if (!options.dir && fs.statSync(fullPath).isDirectory()) {
      directories = { ...traverse(base, fullPath), ...directories };
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
    if (isAbsolute(dirPath)) {
      dirPath = relative(base, dirPath);
    }
    dirs = traverse(base, join(base, dirPath));
  } else if (!Object.keys(directories).length) {
    throw Error('No test file directories found.');
  } else {
    dirs = directories;
  }

  process.stdout.write(
    chalk.bgWhite(chalk.black('\n TESTCASE FUNCTION ')) + '\n * ' + exec
  );

  process.stdout.write(
    chalk.bgWhite(chalk.black('\n\n TESTCASE DIRECTORIES ')) +
      '\n * ' +
      Object.keys(dirs).join('\n * ')
  );

  if (options.target) {
    process.stdout.write(
      chalk.bgWhite(chalk.black('\n\n TARGET DIRECTORY ')) +
        '\n * ' +
        options.target
    );
  }

  process.stdout.write(
    '\n\n' +
      '#'.repeat(22) +
      ' GENERATING SNAPSHOT TESTS ' +
      '#'.repeat(22) +
      '\n'
  );
  const stats = generate(basename(base), dirs, exec, base, options);
  process.stdout.write('\n' + chalk.bgWhite(chalk.black(' RESULTS ')) + '\n');
  printStat(stats.created, ' created: ', chalk.green);
  printStat(stats.skipped, ' skipped: ', chalk.yellow);
  printStat(stats.overwritten, ' overwrote: ', chalk.cyan);

  process.stdout.write('\n' + '#'.repeat(71) + '\n');
};

export default snapshotgun;
