# snapshotgun

Command line tool for automatically generating Jest snapshot tests.

Takes a single test executor JavaScript file and a set of testcase directories and creates a JavaScript test file under each bottom level directory, automatically importing the found test files and the given executor.

[![License][asl-2.0 badge]][asl-2.0] [![Build Status][travis badge]][travis] [![Coverage Status][coverage badge]][coveralls] [![npm version][npm badge]][npm]

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Generating testcases](#generating-testcases)
  - [Test executor](#test-executor)
  - [Test directories](#test-directories)
  - [Expecting errors](#expecting-errors)
  - [Filtering tests](#filtering-tests)
- [Options](#options)

## Installation ([npm](https://www.npmjs.com/package/snapshotgun))

It is recommended that snapshotgun is installed globally, as it is not required as a dependency after it has been run.

#### NPM

```bash
$ npm install snapshotgun --global
```

#### Yarn

```bash
$ yarn global add snapshotgun
```

## Usage

### Generating testcases

Snapshotgun is run from the command line with either:

```bash
$ snapshotgun
```

or its alias:

```bash
$ ssgun
```

By default, it expects to find a single JavaScript file in the current directory that it uses as the [test executor](#test-executor). If multiple candidates, or no candidate files are found, the process terminates with failure code.

Snapshotgun scans the current directory for [test directories](#test-directories) containing JSON files. If no directories are found, the process terminates with failure code.

As the testcase directories are recursively scanned, snapshotgun generates a Jest snapshot test file whenever it finds a bottom level directory that contains at least some JSON files.

For example running in the following directory:

```
* testcases
  * first_test
    * input.json
  * second_test
    * input.json
* executor.adapter.js
```

would generate tests like so:

```
* testcases
  * first_test
    * input.json
    * first_test.test.js
  * second_test
    * input.json
    * second_test.test.js
* executor.adapter.js
```

Snapshotgun automatically imports the given test executor as well as the found test JSON files to the testcases:

```javascript
import execute from "./../executor.adapter.js";
import input from "./input.json";

const files = {
  input
};

it("first_test", () => {
  try {
    expect(execute(files)).toMatchSnapshot();
  } catch (error) {
    expect(error).toMatchSnapshot();
  }
});
```

Once the test files have been generated, the project can be tested with Jest as usual. When the tests are run for the first time, Jest generates snapshot files alongside them, containing the output of the executor. Subsequent test runs will check the output against the previous snapshots.

**You should always verify that the first time generated snapshots match the expected output**

### Test executor

Snapshotgun requires a test executor in order to generate testcases that test the intended functionality. The executor acts as an 'adapter' between your code and snapshotgun, which is imported in the testcases, instead of the actual code.

A test executor _must_ contain a _function_ default export, that receives an object containing all found test files as its sole argument:

#### ES6

```javascript
export default (files = myTestedFunction(files));
```

#### CommonJS

```javascript
module.exports.default = function(files) {
  return myTestedFunction(files);
};
```

In most cases your tested function expects a specific input, so you'll have to unwrap the correct files before passing them on.

### Test directories

Snapshotgun iterates recursively over all directories in the given test directory structure. The test directories can contain any files, but only JSON files will be scanned.

Whenever the iteration reaches a bottom level directory, a test file is created and all found test files in the scope of that directory are linked to it.

For example:

```
* testcases
  * suite
    * first_test
      * input.json
    * second_test
      * input.json
  * test
    * input.json
```

would generate three tests: **first_test**, **second_test** and **test**.

The files found in directories are passed on to lower level directories, so you can create common files for multiple tests. Tests can also overwrite the files passed from their parent.

For example:

```
* testcases
  * data.json
  * first_test
    * input.json
  * second_test
    * input.json
  * third_test
    * input.json
    * data.json
```

would create three tests, where the two first tests would use the common **data.json** from their parent directory, but the third test would overwrite it with its own.

Tests inherit _all_ JSON files in the file structure in this way. Naturally, the files need to be valid JSON, including objects, arrays, numbers and strings.

### Expecting errors

If your testcase throws an error, the generated test will attempt to match that error against the existing snapshot.

Thus, if your test throws an error the first time it is run, the snapshot will contain an error from there on.

**This is why it is extremely important to verify the generated snapshots rather than blindly trusting they are correct**

### Filtering tests

Tests can be filtered with Jest's pattern matching:

```bash
jest -t <my-test-pattern>
```

Each generated testcase is checked against the given pattern and run only if it matches.

Another option is to manually add a 'skip' or 'only' suffix to the test name.

## Options

Snapshotgun's behavior can be customized with command line options:

#### Testcase executor

```
-e, --exec string     Testcase executor path
```

If an executor path is given, that specific executor will be used instead of scanning the current directory

#### Testcase directory

```
-d, --dir string      Testcase directory path
```

If a testcase directory path is given, that specific testcase directory will be used instead of scanning the current directory.

#### Target directory

```
-t, --target string   Target directory path for generated tests
```

If target directory path is given, the generated tests will be placed under that directory instead of the testcase file structure.

#### Mode

```
-m, --mode string     Generation mode: single or multi.
```

Determines the generation mode. Single mode generates a single test case for each bottom level directory, while multi mode generates one for each file found in that directory. Uses single mode by default

**Note:** When using multi generation mode, the executor receives the single input file as its first argument and the rest of found test files as its second argument:

```javascript
export default (input, file) = myTestedFunction(input, file));
```

### Overwrite

```
--overwrite           Overwrite existing tests in target directories
```
If given, overwrites any of the test files that already exist. Otherwise, they are skipped.

#### Dry run

```
--dry-run             Run without actually writing files
```
Runs the process without writing any files.

#### Verbose
```
--dry-run             Run without actually writing files
```
Prints more detailed output during test generation

#### Format
```
-f, --format          string Test format: cjs or es6
```
Determines the format in which the generated test files should be. Uses es6 by default.

#### Help
```
-h, --help            Display this usage guide
```

[Coverage badge]: https://coveralls.io/repos/github/vjrasane/snapshotgun/badge.svg?service=github
[Coveralls]: https://coveralls.io/github/vjrasane/snapshotgun
[ASL-2.0 badge]: https://img.shields.io/badge/License-Apache%202.0-blue.svg
[ASL-2.0]: https://opensource.org/licenses/Apache-2.0
[Travis]: https://travis-ci.org/vjrasane/snapshotgun
[Travis badge]: https://travis-ci.org/vjrasane/snapshotgun.svg?branch=master&service=github
[npm badge]: https://badge.fury.io/js/snapshotgun.svg?service=github
[npm]: https://badge.fury.io/js/snapshotgun
