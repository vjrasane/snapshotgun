import handles from 'handlebars';
import { DOC_TYPE, DIR_TYPE } from './traverse';
import { filterObj, mapObj, toPath, replaceSlashes } from './utils';
import read from './template';

import fs from 'fs';
import { join, relative } from 'path';

const getFilesOfType = (files, type) =>
  filterObj(files, (name, file) => file.type === type);

const generate = (name, files, execute, baseDir, options) => {
  const traverse = (testName, dir, parentDocs) => {
    const contents = dir.contents ? dir.contents : dir;
    const docs = getFilesOfType(contents, DOC_TYPE);
    const dirs = getFilesOfType(contents, DIR_TYPE);

    const inheritedDocs = { ...parentDocs, ...docs };
    if (!Object.keys(dirs).length && Object.keys(docs).length) {
      const testPath = dir.path;
      const absTestPath = join(baseDir, testPath);

      process.stdout.write(' > Generating testcase: ' + testName);

      const executePath = toPath(
        replaceSlashes(relative(absTestPath, join(baseDir, execute)))
      );

      const files = mapObj(inheritedDocs, (name, doc) =>
        toPath(replaceSlashes(relative(testPath, doc.path)))
      );

      const testFileContents = handles.compile(read(options.format))({
        files,
        testName,
        executePath
      });

      const testFileName = join(baseDir, testPath, testName + '.test.js');
      if (!fs.existsSync(testFileName) || options.overwrite) {
        process.stdout.write(' --> Writing');
        fs.writeFileSync(testFileName, testFileContents);
      } else {
        process.stdout.write(' --> Already exists');
      }
      process.stdout.write('     (' + absTestPath + ')\n');
    }
    Object.keys(dirs).forEach(d => traverse(d, dirs[d], inheritedDocs));
  };

  traverse(name, files, {});
};

export default generate;
