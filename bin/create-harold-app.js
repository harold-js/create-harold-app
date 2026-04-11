#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
const cliFilePath = fs.realpathSync(fileURLToPath(import.meta.url));

export const run = async (argv = process.argv) => {
  program
    .version(packageJson.version, '-v, --version', 'Create Harold App version')
    .argument('<projectName>', 'Project directory name')
    .option('-t, --template <type>', 'Template type (bare, default, docs)');

  program.parse(argv);
  program.showHelpAfterError();

  const options = program.opts();
  const rawProjectName = program.args[0];

  if (!rawProjectName || rawProjectName.indexOf('-') === 0) {
    console.log('Please provide project name (directory)');
    process.exit(9);
  }

  const projectName = sanitizeName(rawProjectName);

  if (!projectName) {
    console.log('Please provide a valid project name (directory)');
    process.exit(9);
  }

  if (projectName !== rawProjectName) {
    console.log(`Using sanitized project directory name "${projectName}".`);
  }

  try {
    fs.mkdirSync(projectName);
  } catch (err) {
    if (err?.code === 'EEXIST') {
      console.log(`Directory "${projectName}" already exists.`);
      process.exit(9);
    }

    throw err;
  }

  let templateArchiveFilePath = DEFAULT_PACKAGE_PATH;
  const projectDir = path.join(process.cwd(), projectName);
  const projectSrcDir = path.join(projectDir, 'src');

  // Choose a template if a user passes an option
  if (options.template && Object.keys(TEMPLATES).includes(options.template)) {
    templateArchiveFilePath = TEMPLATES[options.template];
  } else if (options.template) {
    templateArchiveFilePath = options.template;
  }

  try {
    if (isUrl(templateArchiveFilePath)) {
      // Extract required files to proper directories
      // This should be an archive link from a repository
      // Assumption: you have root directory with files in the archive, by default in repository package
      // so, we need to strip one level of directories in the archive
      await triggerDownloadAndExtract(
        templateArchiveFilePath,
        projectSrcDir,
        projectName,
        options
      );
    } else {
      // This should be an archive file from local path
      // Assumption: you have root directory with files in the archive
      // so, we need to strip one level of directories in the archive
      triggerExtract(
        templateArchiveFilePath,
        projectSrcDir,
        projectName,
        options
      );
    }
  } catch (err) {
    fs.rmSync(projectDir, { recursive: true, force: true });
    console.error(
      err instanceof Error ? err.message : 'Project initialization failed.'
    );
    process.exit(1);
  }
};

const isDirectExecution =
  process.argv[1] &&
  fs.existsSync(process.argv[1]) &&
  fs.realpathSync(process.argv[1]) === cliFilePath;

if (isDirectExecution) {
  run().catch((err) => {
    console.error(
      err instanceof Error ? err.message : 'Project initialization failed.'
    );
    process.exit(1);
  });
}
