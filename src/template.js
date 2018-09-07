import fs from 'fs';
import { join, dirname } from 'path';

const templates = {
  es6: 'snapshotgun-es6',
  cjs: 'snapshotgun-cjs'
};

const read = (format, mode) => {
  const name = templates[format] || templates.es6;
  const fullName = name + (mode ? '-' + mode : '') + '.template';
  const templatePath = join(dirname(dirname(module.filename)), 'resources', fullName);
  const contents = fs.readFileSync(templatePath, 'utf-8');
  return contents;
};

export default read;
