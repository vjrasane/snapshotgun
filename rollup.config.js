import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { uglify } from 'rollup-plugin-uglify';

export default {
  external: ['path', 'fs', 'handlebars', 'command-line-args'],
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    banner: '#! /usr/bin/env node'
  },
  plugins: [
    progress(),
    babel({
      babelrc: false,
      presets: [['env', { modules: false }]],
      plugins: [
        'external-helpers',
        'transform-class-properties',
        'transform-object-rest-spread'
      ]
    }),
    uglify(),
    filesize()
  ]
};
