import fs from 'fs';
import { join, dirname } from 'path';

const read = name => {
  const templatePath = join(dirname(dirname(module.filename)), 'resources', name);
  const contents = fs.readFileSync(templatePath, 'utf-8');
  return contents;
};

export default read;
