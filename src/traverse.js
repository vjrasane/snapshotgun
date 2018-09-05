import fs from 'fs';
import relativePath from './relative_path';
import { join, resolve, dirname } from 'path';

export const DIR_TYPE = 'dir';
export const DOC_TYPE = 'doc';

const traverse = (caller, parentPath) => {
  const hierarchy = {};

  const path = !parentPath
    ? dirname(caller.filename)
    : resolve(dirname(caller.filename), parentPath);

  fs.readdirSync(path).forEach(filename => {
    const fullPath = join(path, filename);
    const relPath = relativePath(dirname(caller.filename), fullPath);
    const basePath = relativePath(fullPath, dirname(caller.filename));

    if (fs.statSync(fullPath).isDirectory()) {
      const files = traverse(caller, fullPath);
      if (Object.keys(files).length) {
        hierarchy[filename] = {
          type: DIR_TYPE,
          path: relPath,
          base: basePath,
          contents: files
        };
      }
    } else if (fullPath !== caller.filename) {
      hierarchy[filename] = {
        type: DOC_TYPE,
        path: relPath,
        base: basePath
      };
    }
  });

  return hierarchy;
};

export default traverse;
