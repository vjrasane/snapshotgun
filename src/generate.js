import handles from 'handlebars';
import { DOC_TYPE, DIR_TYPE } from './traverse';
import { filterObj, mapObj, toPath } from './utils';
import read from './template';
import relativePath from './relative';

import fs from 'fs';
import { join } from 'path';

const getFilesOfType = (files, type) =>
  filterObj(files, (name, file) => file.type === type);

const generate = (name, files, execute, baseDir, options) => {
  process.stdout.write('\n======= GENERATING TESTCASES =======\n');
  const traverse = (testName, dir, parentDocs) => {
    const contents = dir.contents ? dir.contents : dir;
    const docs = getFilesOfType(contents, DOC_TYPE);
    const dirs = getFilesOfType(contents, DIR_TYPE);

    const inheritedDocs = { ...parentDocs, ...docs };
    if (!Object.keys(dirs).length && Object.keys(docs).length) {
      const testPath = dir.path;
      const absTestPath = join(baseDir, testPath);

      process.stdout.write(' > Generating testcase: ' + testName + '\n');
      process.stdout.write(' (' + absTestPath + ')\n');

      const executePath = toPath(
        relativePath(absTestPath, join(baseDir, execute))
      );

      const files = mapObj(inheritedDocs, (name, doc) =>
        toPath(relativePath(testPath, doc.path))
      );

      const testFileContents = handles.compile(
        read('snapshotgun-es6.template')
      )({
        files,
        testName,
        executePath
      });

      const testFileName = join(baseDir, testPath, testName + '.test.js');
      if (!fs.existsSync(testFileName) || options.overwrite) {
        fs.writeFileSync(testFileName, testFileContents);
      }
    }
    Object.keys(dirs).forEach(d => traverse(d, dirs[d], inheritedDocs));
  };

  traverse(name, files, {});
};

export default generate;
