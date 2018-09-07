import args from 'command-line-args';
import snapshotgun from './snapshotgun';
import fs from 'fs';
import { isAbsolute, relative } from 'path';
// import relative from './relative';
// import { join, normalize } from 'path';

const processDir = process.cwd();

const file = filename => {
  if (!fs.existsSync(filename)) {
    throw Error("No such file or directory '" + filename + "'");
  }
  return isAbsolute(filename) ? relative(processDir, filename) : filename;
};

const opts = [
  { name: 'exec', alias: 'e', type: f => file(f) },
  { name: 'dir', alias: 'd', type: f => file(f) },
  { name: 'target', alias: 't', type: f => file(f) },
  { name: 'mode', alias: 'm', type: String },
  { name: 'overwrite', type: Boolean },
  { name: 'format', type: String }
];

snapshotgun(processDir, args(opts));
