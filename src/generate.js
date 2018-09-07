import handles from 'handlebars';
import { DOC_TYPE, DIR_TYPE } from './traverse';
import { filterObj, mapObj, toPath, replaceSlashes } from './utils';
import read from './template';

import fs from 'fs';
import { join, relative, isAbsolute } from 'path';

const getFilesOfType = (files, type) =>
  filterObj(files, (name, file) => file.type === type);

const generate = (name, files, execute, baseDir, options) => {
  const getTestPath = testDir => {
    if (options.target) {
      if (isAbsolute(options.target)) {
        return replaceSlashes(relative(baseDir, options.target));
      } else {
        return options.target;
      }
    } else {
      return testDir.path;
    }
  };

  const writeTest = (name, path, contents) => {
    const testFileName = join(baseDir, path, name + '.test.js');
    if (!fs.existsSync(testFileName) || options.overwrite) {
      process.stdout.write(' --> Writing');
      fs.writeFileSync(testFileName, contents);
    } else {
      process.stdout.write(' --> Already exists');
    }
  };

  const multipleTests = (testDir, docs, parentDocs) => {
    Object.keys(docs).forEach(doc => {
      const testName = doc;
      const testPath = getTestPath(testDir);
      const absTestPath = join(baseDir, testPath);

      process.stdout.write(' > Generating testcase: ' + testName);

      const executePath = toPath(
        replaceSlashes(relative(absTestPath, join(baseDir, execute)))
      );

      const mainFile = toPath(replaceSlashes(relative(testPath, docs[doc].path)));

      const files = mapObj(parentDocs, (name, doc) =>
        toPath(replaceSlashes(relative(testPath, doc.path)))
      );

      const testFileContents = handles.compile(read(options.format, 'multi'))({
        mainFile,
        files,
        testName,
        executePath
      });

      writeTest(testName, testPath, testFileContents);
    });
  };

  const singleTest = (testName, testDir, docs) => {
    const testPath = getTestPath(testDir);
    const absTestPath = join(baseDir, testPath);

    process.stdout.write(' > Generating testcase: ' + testName);

    const executePath = toPath(
      replaceSlashes(relative(absTestPath, join(baseDir, execute)))
    );

    const files = mapObj(docs, (name, doc) =>
      toPath(replaceSlashes(relative(testPath, doc.path)))
    );

    const testFileContents = handles.compile(read(options.format))({
      files,
      testName,
      executePath
    });

    writeTest(testName, testPath, testFileContents);
  };

  const traverse = (testName, dir, parentDocs) => {
    const contents = dir.contents ? dir.contents : dir;
    const docs = getFilesOfType(contents, DOC_TYPE);
    const dirs = getFilesOfType(contents, DIR_TYPE);

    const inheritedDocs = { ...parentDocs, ...docs };
    if (!Object.keys(dirs).length && Object.keys(docs).length) {
      if (options.mode === 'multi') {
        multipleTests(dir, docs, parentDocs);
      } else {
        singleTest(testName, dir, inheritedDocs);
      }
    }
    Object.keys(dirs).forEach(d => traverse(d, dirs[d], inheritedDocs));
  };

  traverse(name, files, {});
};

export default generate;
