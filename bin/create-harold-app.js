#!/usr/bin/env node

import spawn from 'cross-spawn';
import { program } from 'commander';
import sanitizeName from 'sanitize-filename';
import isUrl from 'is-absolute-url';
import { createRequire } from 'node:module';
import {
  DEFAULT_PACKAGE_PATH,
  TEMPLATES,
  triggerDownloadAndExtract,
  triggerExtract,
} from './utils.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

const args = process.argv;
const projectName = args ? args[2] : undefined;

program
  .option('-t, --template <type>', 'Template type (bare, default, docs)')
  .option('-v, --version', 'Create Harold App version');
program.parse(process.argv);
program.showHelpAfterError();

const options = program.opts();

// Show version number
if (options.version) {
  console.log(packageJson.version);
  process.exit(9);
}

if (!projectName || projectName.indexOf('-') === 0) {
  console.log('Please provide project name (directory)');
  process.exit(9);
}

// Create project directory
spawn.sync('mkdir', [sanitizeName(projectName)], { stdio: 'inherit' });

let templateArchiveFilePath = DEFAULT_PACKAGE_PATH;

// Choose a template if a user passes an option
if (options.template && Object.keys(TEMPLATES).includes(options.template)) {
  templateArchiveFilePath = TEMPLATES[options.template];
} else if (options.template) {
  templateArchiveFilePath = options.template;
}

if (isUrl(templateArchiveFilePath)) {
  // Extract required files to proper directories
  // This should be an archive link from a repository
  // Assumption: you have root directory with files in the archive, by default in repository package
  // so, we need to strip one level of directories in the archive
  triggerDownloadAndExtract(
    templateArchiveFilePath,
    process.cwd() + '/' + projectName + '/src',
    projectName,
    options
  );
} else {
  // This should be an archive file from local path
  // Assumption: you have root directory with files in the archive
  // so, we need to strip one level of directories in the archive
  triggerExtract(
    templateArchiveFilePath,
    process.cwd() + '/' + projectName + '/src',
    projectName,
    options
  );
}
