import fs from 'fs';
import { join, dirname } from 'path';

const templates = {
  es6: 'snapshotgun-es6.template',
  cjs: 'snapshotgun-cjs.template'
};

const read = format => {
  const name = templates[format] || templates.es6;
  const templatePath = join(dirname(dirname(module.filename)), 'resources', name);
  const contents = fs.readFileSync(templatePath, 'utf-8');
  return contents;
};

export default read;
