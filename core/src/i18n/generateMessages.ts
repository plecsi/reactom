import path from 'path';
import * as glob from 'glob';
import fs from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';
import type { LocaleConfig } from './types';

const config: LocaleConfig = {
  defaultLocale: 'en',
  locales: ['en', 'hu'],
  messageFilePattern: './**/*[mM]essages.{js,ts}',
  outDir: 'translations',
  sourceLocale: 'en',
};

const { outDir, messageFilePattern } = config;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, outDir);
const files = glob.sync(messageFilePattern, {
  absolute: true,
  ignore: '**/node_modules/**',
});

// Read existing translations if present
function readExistingTranslations(lang: string): Record<string, string> {
  const outputFile = path.join(outputDir, `${lang}.json`);
  if (fs.existsSync(outputFile)) {
    try {
      return JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

async function processFiles() {
  const allMessages: Record<string, any> = {};
  const existing: Record<string, Record<string, string>> = {};

  for (const lang of config.locales) {
    existing[lang] = readExistingTranslations(lang);
    allMessages[lang] = {};
  }

  for (const file of files) {
    let messages: unknown;
    try {
      const imported = await import(pathToFileURL(file).href);
      messages = imported.default || imported;
    } catch {
      continue;
    }
    if (!messages || typeof messages !== 'object') continue;

    for (const key of Object.keys(messages)) {
      const msgObj = (messages as Record<string, any>)[key];
      if (
        msgObj &&
        typeof msgObj === 'object' &&
        'id' in msgObj &&
        'defaultMessage' in msgObj
      ) {
        for (const lang of config.locales) {
          if (lang === config.defaultLocale) {
            allMessages[lang][msgObj.id] = msgObj.defaultMessage;
          } else {
            allMessages[lang][msgObj.id] =
              existing[lang][msgObj.id] ?? '';
          }
        }
      }
    }
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const lang of config.locales) {
    const outputFile = path.join(outputDir, `${lang}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(allMessages[lang], null, 2), 'utf8');
    console.log(`Generated ${outputFile}`);
  }
}

processFiles();