#!/usr/bin/env node

const spawn = require('cross-spawn');
const { program } = require('commander');
const sanitizeName = require('sanitize-filename');
const download = require('download');
const decompress = require('decompress');
const isUrl = require('is-absolute-url');
const fs = require('fs');

const TEMPLATE_BARE_NAME = 'bare';
const TEMPLATE_DEFAULT_NAME = 'default';
const TEMPLATE_DOCS_NAME = 'docs';

const BARE_PACKAGE_PATH =
  'https://github.com/juliancwirko/harold-template-bare/archive/refs/heads/main.zip';
const DEFAULT_PACKAGE_PATH =
  'https://github.com/juliancwirko/harold-template-default/archive/refs/heads/main.zip';
const DOCS_PACKAGE_PATH =
  'https://github.com/juliancwirko/harold-template-docs/archive/refs/heads/main.zip';

const TEMPLATES = {
  [TEMPLATE_BARE_NAME]: BARE_PACKAGE_PATH,
  [TEMPLATE_DEFAULT_NAME]: DEFAULT_PACKAGE_PATH,
  [TEMPLATE_DOCS_NAME]: DOCS_PACKAGE_PATH,
};

const packageJson = require('../package.json');

const args = process.argv;
const projectName = args ? args[2] : undefined;

program
  .option('-t, --template <type>', 'template type (bare, default)')
  .option('-v, --version', 'Create Harold App version');
program.parse(process.argv);

const options = program.opts();

// Show version number
if (options.version) {
  console.log(packageJson.version);
  return;
}

if (!projectName || projectName.indexOf('-') === 0) {
  console.log('Please provide project name (directory)');
  return;
}

// Write proper package.json file for the project
// Run install script
const projectInit = () => {
  fs.readFile(
    __dirname + '/' + 'packagejson.template',
    'utf8',
    function (err, data) {
      if (err) {
        return console.log(err);
      }

      const result = data.replace(/{{projectName}}/g, projectName);

      fs.writeFile(
        process.cwd() + '/' + projectName + '/' + 'package.json',
        result,
        'utf8',
        function (err) {
          if (err) return console.log(err);

          // Install packages in the newly created project
          process.chdir(projectName);
          spawn.sync('npm', ['install'], { stdio: 'inherit' });
          process.chdir('..');
        }
      );
    }
  );
};

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
  download(
    templateArchiveFilePath,
    process.cwd() + '/' + projectName + '/src',
    { extract: true, strip: 1 }
  )
    .then(projectInit)
    .catch((err) => {
      if (err)
        console.log(
          "Can't download the " +
            options.template +
            ' template: (' +
            err.statusCode +
            ': ' +
            err.statusMessage +
            ')'
        );
    });
} else {
  // This should be an archive file from local path
  // Assumption: you have root directory with files in the archive
  // so, we need to strip one level of directories in the archive
  decompress(
    templateArchiveFilePath,
    process.cwd() + '/' + projectName + '/src',
    { strip: 1 }
  )
    .then(projectInit)
    .catch((err) => {
      if (err)
        console.log(
          "Can't extract the " +
            options.template +
            ' template: (' +
            err.statusCode +
            ': ' +
            err.statusMessage +
            ')'
        );
    });
}
