// @ts-check
// 🚨
// 🚨 CHANGES TO THIS FILE WILL BE OVERRIDDEN
// 🚨
import { app } from '@technobuddha/project';

/**
 * @import { type Linter } from 'eslint';
 * @type {Linter.Config[]}
 */
const config = [
  // src/tsconfig.json
  app.lint({
    files: ['src/*.tsx'],
    ignores: [],
    environment: 'browser',
    tsConfig: 'src/tsconfig.json',
    react: true,
  }),
  // tsconfig.json
  app.lint({ files: ['*.config.js'], ignores: [], environment: 'node' }),
];

export default config;
