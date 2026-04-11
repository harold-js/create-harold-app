import fs from 'node:fs';
import spawn from 'cross-spawn';
import axios from 'axios';
import AdmZip from 'adm-zip';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const packageJson = require('../package.json');
const haroldScriptsVersion = packageJson.createHaroldApp?.['harold-scripts'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TEMPLATE_BARE_NAME = 'bare';
export const TEMPLATE_DEFAULT_NAME = 'default';
export const TEMPLATE_DOCS_NAME = 'docs';

export const BARE_PACKAGE_PATH =
  'https://github.com/harold-js/harold-template-bare/archive/refs/heads/main.zip';
export const DEFAULT_PACKAGE_PATH =
  'https://github.com/harold-js/harold-template-default/archive/refs/heads/main.zip';
export const DOCS_PACKAGE_PATH =
  'https://github.com/harold-js/harold-template-docs/archive/refs/heads/main.zip';

export const getRepoDirName = (template) => `harold-template-${template}-main`;

export const TEMPLATES = {
  [TEMPLATE_BARE_NAME]: BARE_PACKAGE_PATH,
  [TEMPLATE_DEFAULT_NAME]: DEFAULT_PACKAGE_PATH,
  [TEMPLATE_DOCS_NAME]: DOCS_PACKAGE_PATH,
};

export const renderProjectPackageJson = (projectName) => {
  const templatePath = path.join(__dirname, 'packagejson.template');
  const template = fs.readFileSync(templatePath, 'utf8');

  if (!haroldScriptsVersion) {
    throw new Error(
      'Missing createHaroldApp["harold-scripts"] in create-harold-app package.json'
    );
  }

  return template
    .replace(/{{projectName}}/g, projectName)
    .replace(/{{haroldScriptsVersion}}/g, haroldScriptsVersion);
};

export const getArchiveEntryPath = (entryName, rootDirName) => {
  const entryPathParts = entryName.split('/');

  if (entryPathParts[0] !== rootDirName) {
    throw new Error(
      'Your custom template archive should include one root directory.'
    );
  }

  return entryPathParts.slice(1).join('/');
};

export const resolveArchiveTargetPath = (baseDir, entryName) => {
  const basePath = path.resolve(baseDir);
  const targetPath = path.resolve(basePath, entryName);
  const relativePath = path.relative(basePath, targetPath);

  if (
    relativePath === '..' ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Archive entry escapes target directory: ${entryName}`);
  }

  return targetPath;
};

export const installProjectDependencies = (projectName) => {
  const previousCwd = process.cwd();

  try {
    process.chdir(projectName);
    const result = spawn.sync('npm', ['install'], { stdio: 'inherit' });

    if (result.error) {
      throw result.error;
    }

    if (result.status !== 0) {
      process.exit(result.status ?? 1);
    }
  } finally {
    process.chdir(previousCwd);
  }
};

// Write proper package.json file for the project
// Run install script
export const projectInit = (projectName) => {
  const packageJsonPath = path.join(process.cwd(), projectName, 'package.json');
  const projectPackageJson = renderProjectPackageJson(projectName);

  fs.writeFileSync(packageJsonPath, projectPackageJson, 'utf8');

  // Install packages in the newly created project
  installProjectDependencies(projectName);
};

export const triggerExtract = (fileNameOrRawData, dirPath, projectName) => {
  const zip = new AdmZip(fileNameOrRawData);
  const zipEntries = zip.getEntries();

  // Get the name of the root directory in the archive
  const mainDirInZipName = zipEntries?.[0]?.entryName?.split('/')?.[0];

  if (!mainDirInZipName) {
    console.log('Your custom template archive should include root directory!');
    process.exit(9);
  }

  zipEntries.forEach((entry) => {
    const flattenedEntryName = getArchiveEntryPath(
      entry.entryName,
      mainDirInZipName
    );
    const targetPath = resolveArchiveTargetPath(dirPath, flattenedEntryName);

    // If the entry is a directory, create it in the extraction directory
    if (entry.isDirectory) {
      fs.mkdirSync(targetPath, { recursive: true });
    } else {
      // If the entry is a file, extract it to the extraction directory
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, entry.getData());
    }
  });

  projectInit(projectName);
};

export const triggerDownloadAndExtract = async (
  resourceUrl,
  dirPath,
  projectName,
  options
) => {
  try {
    const response = await axios.get(resourceUrl, {
      responseType: 'arraybuffer',
    });

    triggerExtract(response.data, dirPath, projectName);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const errorDetails = [err.code, err.response?.status ?? err.status]
        .filter(
          (value) => value !== undefined && value !== null && value !== ''
        )
        .join(':');

      throw new Error(
        `Can't download the ${options.template} template${
          errorDetails ? ` (${errorDetails})` : ''
        }`,
        { cause: err }
      );
    }

    throw err;
  }
};
