#!/usr/bin/env node

const spawn = require('cross-spawn');
const { program } = require('commander');
const sanitizeName = require('sanitize-filename');
const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');

const TEMPLATES = ['bare', 'default'];

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

  let templateName = 'default';

  // Choose template if user passes an option
  if (options.template && TEMPLATES.includes(options.template)) {
    templateName = options.template;
  }

  // Copy required files to proper directories
  fse
    .copy(
      path.join(__dirname, '../templates/' + templateName),
      process.cwd() + '/' + projectName + '/src'
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
      if (err) console.log(err);
    });
} else {
  console.log('Please provide project name (directory)');
}
