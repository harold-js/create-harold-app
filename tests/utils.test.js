import fs from 'node:fs';
import os from 'node:os';
import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import AdmZip from 'adm-zip';
import axios from 'axios';
import spawn from 'cross-spawn';
import {
  getArchiveEntryPath,
  installProjectDependencies,
  renderProjectPackageJson,
  resolveArchiveTargetPath,
  triggerDownloadAndExtract,
  triggerExtract,
} from '../bin/utils.js';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const cliPath = fileURLToPath(
  new URL('../bin/create-harold-app.js', import.meta.url)
);

const createTemplateArchiveBuffer = (files) => {
  const archive = new AdmZip();

  Object.entries(files).forEach(([entryName, content]) => {
    archive.addFile(entryName, Buffer.from(content));
  });

  return archive.toBuffer();
};

describe('create-harold-app utils', { concurrency: false }, () => {
  it('renders a package.json with the current harold-scripts version', () => {
    const renderedPackageJson = renderProjectPackageJson('demo-blog');

    assert.match(renderedPackageJson, /"name": "demo-blog"/);
    assert.ok(
      renderedPackageJson.includes(
        `"harold-scripts": "${packageJson.createHaroldApp['harold-scripts']}"`
      )
    );
  });

  it('keeps archive entries inside the target directory', () => {
    const baseDir = path.join('/tmp', 'demo-app', 'src');
    const targetPath = resolveArchiveTargetPath(baseDir, 'posts/hello.md');

    assert.equal(targetPath, path.join(baseDir, 'posts', 'hello.md'));
  });

  it('rejects archive entries that escape the target directory', () => {
    const baseDir = path.join('/tmp', 'demo-app', 'src');

    assert.throws(
      () => resolveArchiveTargetPath(baseDir, '../package.json'),
      /escapes target directory/
    );
  });

  it('strips the archive root directory from entry names', () => {
    const entryPath = getArchiveEntryPath(
      'harold-template-default-main/src/index.hbs',
      'harold-template-default-main'
    );

    assert.equal(entryPath, 'src/index.hbs');
  });

  it('propagates npm install exit codes', () => {
    const exit = mock.method(process, 'exit', (code) => {
      throw new Error(`exit:${code}`);
    });
    const chdir = mock.method(process, 'chdir', () => {});
    const sync = mock.method(spawn, 'sync', () => ({ status: 7 }));

    assert.throws(() => installProjectDependencies('demo-app'), /exit:7/);

    sync.mock.restore();
    chdir.mock.restore();
    exit.mock.restore();
  });

  it('extracts a local template archive into the project src directory', () => {
    const originalCwd = process.cwd();
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'create-harold-app-local-template-')
    );
    const projectName = 'demo-app';
    const projectDir = path.join(tempDir, projectName);
    const srcDir = path.join(projectDir, 'src');
    const archivePath = path.join(tempDir, 'main.zip');
    const installCalls = [];
    const archive = new AdmZip();

    archive.addFile('template-main/index.hbs', Buffer.from('<h1>Hello</h1>'));
    archive.addFile(
      'template-main/.haroldrc',
      Buffer.from('{ "theme": "docs" }')
    );
    archive.addFile(
      'template-main/posts/hello.md',
      Buffer.from('# Hello Harold')
    );
    archive.writeZip(archivePath);
    fs.mkdirSync(projectDir);

    const sync = mock.method(spawn, 'sync', (...args) => {
      installCalls.push(args);
      return { status: 0 };
    });

    try {
      process.chdir(tempDir);
      triggerExtract('./main.zip', srcDir, projectName);

      assert.equal(
        fs.readFileSync(path.join(srcDir, 'index.hbs'), 'utf8'),
        '<h1>Hello</h1>'
      );
      assert.equal(
        fs.readFileSync(path.join(srcDir, '.haroldrc'), 'utf8'),
        '{ "theme": "docs" }'
      );
      assert.equal(
        fs.readFileSync(path.join(srcDir, 'posts', 'hello.md'), 'utf8'),
        '# Hello Harold'
      );
      assert.match(
        fs.readFileSync(path.join(projectDir, 'package.json'), 'utf8'),
        /"name": "demo-app"/
      );
      assert.equal(fs.existsSync(path.join(projectDir, 'index.hbs')), false);
      assert.equal(fs.existsSync(path.join(projectDir, '.haroldrc')), false);
      assert.equal(
        fs.existsSync(path.join(projectDir, 'posts', 'hello.md')),
        false
      );
      assert.deepEqual(installCalls, [
        ['npm', ['install'], { stdio: 'inherit' }],
      ]);
    } finally {
      process.chdir(originalCwd);
      sync.mock.restore();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('downloads and extracts a remote template archive', async () => {
    const originalCwd = process.cwd();
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'create-harold-app-remote-template-')
    );
    const projectName = 'docs-app';
    const projectDir = path.join(tempDir, projectName);
    const srcDir = path.join(projectDir, 'src');
    const templateUrl = 'https://example.com/template.zip';
    const installCalls = [];
    const axiosCalls = [];
    const archiveBuffer = createTemplateArchiveBuffer({
      'template-main/index.hbs': '<main>Docs</main>',
      'template-main/docs/getting-started.md': '# Getting started',
    });

    fs.mkdirSync(projectDir);

    const get = mock.method(axios, 'get', async (...args) => {
      axiosCalls.push(args);
      return { data: archiveBuffer };
    });
    const sync = mock.method(spawn, 'sync', (...args) => {
      installCalls.push(args);
      return { status: 0 };
    });

    try {
      process.chdir(tempDir);
      await triggerDownloadAndExtract(templateUrl, srcDir, projectName, {
        template: templateUrl,
      });

      assert.equal(
        fs.readFileSync(path.join(srcDir, 'index.hbs'), 'utf8'),
        '<main>Docs</main>'
      );
      assert.equal(
        fs.readFileSync(
          path.join(srcDir, 'docs', 'getting-started.md'),
          'utf8'
        ),
        '# Getting started'
      );
      assert.deepEqual(axiosCalls, [
        [templateUrl, { responseType: 'arraybuffer' }],
      ]);
      assert.deepEqual(installCalls, [
        ['npm', ['install'], { stdio: 'inherit' }],
      ]);
    } finally {
      process.chdir(originalCwd);
      sync.mock.restore();
      get.mock.restore();
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it('rejects with a helpful message when a template download fails', async () => {
    const templateUrl = 'https://example.com/template.zip';
    const get = mock.method(axios, 'get', async () => {
      const error = new Error('download failed');
      error.code = 'ERR_BAD_REQUEST';
      error.status = 404;
      throw error;
    });
    const isAxiosError = mock.method(axios, 'isAxiosError', () => true);

    try {
      await assert.rejects(
        triggerDownloadAndExtract(templateUrl, '/tmp/demo-app/src', 'demo', {
          template: templateUrl,
        }),
        /Can't download the https:\/\/example\.com\/template\.zip template \(ERR_BAD_REQUEST:404\)/
      );
    } finally {
      isAxiosError.mock.restore();
      get.mock.restore();
    }
  });

  it('removes the project directory when CLI initialization fails', () => {
    const tempDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'create-harold-app-cli-failure-')
    );
    const projectName = 'demo-app';
    const result = spawnSync(
      process.execPath,
      [cliPath, projectName, '-t', './missing.zip'],
      {
        cwd: tempDir,
        encoding: 'utf8',
      }
    );

    try {
      assert.equal(result.status, 1);
      assert.equal(fs.existsSync(path.join(tempDir, projectName)), false);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
