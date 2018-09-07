import fs from 'fs';
import { join, basename, relative } from 'path';
import { replaceSlashes, getFileName } from './utils';

export const DIR_TYPE = 'dir';
export const DOC_TYPE = 'doc';

const isJson = file => new RegExp('\\.json$', 'i').test(file);

const traverse = (basePath, path) => {
  const hierarchy = {};

  fs.readdirSync(path).forEach(filename => {
    const fullPath = replaceSlashes(join(path, filename));
    const relPath = replaceSlashes(relative(basePath, fullPath));

    if (fs.statSync(fullPath).isDirectory()) {
      const files = traverse(basePath, fullPath);
      if (Object.keys(files).length) {
        hierarchy[getFileName(filename)] = {
          type: DIR_TYPE,
          path: relPath,
          contents: files
        };
      }
    } else if (isJson(filename)) {
      hierarchy[getFileName(filename)] = {
        type: DOC_TYPE,
        path: relPath
      };
    }
  });

  return hierarchy;
};

const traverseDir = (basePath, directory) => ({
  [basename(directory)]: {
    type: DIR_TYPE,
    path: replaceSlashes(relative(basePath, directory)),
    contents: traverse(basePath, directory)
  }
});

export default traverseDir;
