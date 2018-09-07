export default [
  {
    header: 'Overview',
    content:
      'Generates Jest snapshot tests from given file structure and its JSON contents.'
  },
  {
    header: 'Synopsis',
    content: [
      '$ snapshotgun [{bold --exec} {underline file}] [{bold --dir} {underline directory}] [{bold --target} {underline directory}] ...',
      '$ snapshotgun [{bold --mode} {underline single/multi}] [{bold --format} {underline cjs/es6}] ...',
      '$ snapshotgun [{bold --overwrite}] [{bold --dry-run}] [{bold --verbose}] ...',
      '$ snapshotgun {bold --help}'
    ]
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'help',
        alias: 'h',
        description: 'Display this usage guide',
        type: Boolean
      },
      {
        name: 'exec',
        alias: 'e',
        description: 'Testcase executor path',
        type: String
      },
      {
        name: 'dir',
        alias: 'd',
        description: 'Testcase directory path',
        type: String
      },
      {
        name: 'target',
        alias: 't',
        description: 'Target directory path for generated tests',
        type: String
      },
      {
        name: 'mode',
        alias: 'm',
        description:
          'Generation mode: single or multi. Single mode generates a single test case for each bottom level directory, while multi mode generates one for each file found in that directory.',
        type: String
      },
      {
        name: 'overwrite',
        description: 'Overwrite existing tests in target directories',
        type: Boolean
      },
      {
        name: 'dry-run',
        description: 'Run without actually writing files',
        type: Boolean
      },
      {
        name: 'verbose',
        alias: 'v',
        description: 'Verbose output',
        type: Boolean
      },
      {
        name: 'format',
        alias: 'f',
        description: 'Test format: cjs or es6',
        type: String
      }
    ]
  },
  {
    content: 'Project home: {underline https://github.com/vjrasane/snapshotgun}'
  }
];
