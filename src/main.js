import args from 'command-line-args';
import snapshotgun from './snapshotgun';
import fs from 'fs';
import { isAbsolute, relative, join, dirname } from 'path';
import chalk from 'chalk';
import usage from './usage';
import cliUsage from 'command-line-usage';

const processDir = process.cwd();

const readLogo = () => {
  const path = join(dirname(dirname(module.filename)), 'resources/logo.txt');
  const contents = fs.readFileSync(path, 'utf-8');
  return contents;
};

const file = filename => {
  if (!fs.existsSync(filename)) {
    throw Error("No such file or directory '" + filename + "'");
  }
  return isAbsolute(filename) ? relative(processDir, filename) : filename;
};

const opts = [
  { name: 'help', alias: 'h', type: Boolean },
  { name: 'exec', alias: 'e', type: f => file(f) },
  { name: 'dir', alias: 'd', type: f => file(f) },
  { name: 'target', alias: 't', type: f => file(f) },
  { name: 'mode', alias: 'm', type: String },
  { name: 'overwrite', type: Boolean },
  { name: 'dry-run', type: Boolean },
  { name: 'verbose', alias: 'v', type: Boolean },
  { name: 'format', alias: 'f', type: String }
];

const displayUsage = () => process.stdout.write('\n' + cliUsage(usage));

try {
  process.stdout.write(chalk.magenta(readLogo()));
  process.stdout.write('#'.repeat(71) + '\n');
  const options = args(opts);
  if (options.help) {
    displayUsage();
  } else {
    snapshotgun(processDir, options);
  }
  process.stdout.write(chalk.green('\nFINISHED'));
} catch (error) {
  process.stdout.write(chalk.red('\nFAILED: ') + error.message);
  displayUsage();
  process.exit(1);
}
