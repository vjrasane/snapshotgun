import fs from 'fs';
import relativePath from './relative';
import { join, basename } from 'path';

export const DIR_TYPE = 'dir';
export const DOC_TYPE = 'doc';

const getFileName = file => file.replace(/\.[^/.]+$/, '');
const isJson = file => new RegExp('\\.json$', 'i').test(file);

const traverse = (basePath, path) => {
  const hierarchy = {};

  fs.readdirSync(path).forEach(filename => {
    const fullPath = join(path, filename);
    const relPath = relativePath(basePath, fullPath);

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
    path: relativePath(basePath, directory),
    contents: traverse(basePath, directory)
  }
});

export default traverseDir;
