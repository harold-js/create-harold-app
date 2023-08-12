import fs from 'node:fs';
import spawn from 'cross-spawn';
import axios from 'axios';
import AdmZip from 'adm-zip';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

// Write proper package.json file for the project
// Run install script
export const projectInit = (projectName) => {
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
    const entryName = entry.entryName;
    const flattenedEntryName = entryName.replace(mainDirInZipName, '');

    // If the entry is a directory, create it in the extraction directory
    if (entry.isDirectory) {
      const targetDir = path.join(dirPath, flattenedEntryName);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }
    } else {
      // If the entry is a file, extract it to the extraction directory
      const targetFilePath = path.join(dirPath, flattenedEntryName);
      fs.writeFileSync(targetFilePath, entry.getData());
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
      console.log(
        `Can't download the ${options.template} template: (${err.code}:${err.status})`
      );
    }
  }
};
