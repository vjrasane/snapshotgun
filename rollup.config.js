import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import progress from 'rollup-plugin-progress';
import { uglify } from 'rollup-plugin-uglify';

const production = !process.env.ROLLUP_WATCH;

export default {
  external: ['path', 'fs'],
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'cjs',
    sourcemap: true,
    banner: '#! /usr/bin/env node'
  },
  plugins: [
    progress(),
    production &&
      babel({
        babelrc: false,
        presets: [['env', { modules: false }]],
        plugins: [
          'external-helpers',
          'transform-class-properties',
          'transform-object-rest-spread'
        ]
      }),
    resolve({
      preferBuiltins: true,
      module: true,
      main: true
    }),
    commonjs({
      include: 'node_modules/**',
      ignoreGlobal: true
    }),
    production && uglify(),
    filesize()
  ]
};
