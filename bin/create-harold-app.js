#!/usr/bin/env node

const spawn = require('cross-spawn');
const { program } = require('commander');
const sanitizeName = require('sanitize-filename');
const download = require('download');
const fs = require('fs');

const TEMPLATE_BARE_NAME = 'bare';
const TEMPLATE_DEFAULT_NAME = 'default';
const TEMPLATES = [TEMPLATE_BARE_NAME, TEMPLATE_DEFAULT_NAME];
const BARE_PACKAGE_PATH =
  'https://github.com/juliancwirko/harold-template-bare/archive/refs/heads/main.zip';
const DEFAULT_PACKAGE_PATH =
  'https://github.com/juliancwirko/harold-template-default/archive/refs/heads/main.zip';

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

if (projectName && projectName.indexOf('-') !== 0) {
  // Create project directory
  spawn.sync('mkdir', [sanitizeName(projectName)], { stdio: 'inherit' });

  let templateArchiveFilePath = DEFAULT_PACKAGE_PATH;

  // Choose template if user passes an option
  if (options.template && TEMPLATES.includes(options.template)) {
    templateArchiveFilePath =
      options.template === TEMPLATE_BARE_NAME
        ? BARE_PACKAGE_PATH
        : DEFAULT_PACKAGE_PATH;
  }

  // Extract required files to proper directories
  download(
    templateArchiveFilePath,
    process.cwd() + '/' + projectName + '/src',
    { extract: true, strip: 1 }
  )
    .then(() => {
      // Write proper package.json file for the project
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
    })
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
  console.log('Please provide project name (directory)');
}
