import fs from 'fs';
import { PROJECT_ROOT } from '../src/const';
import path from 'path';
import { log } from '../src/utils';

interface Dictionary {
  [key: string]: string;
}

let dictionary: Dictionary = {};
let loaded = false;

function loadDictionary(locale: string): boolean {
  const dicPath = path.join(PROJECT_ROOT, 'i18n', `${locale}.json`);
  if (!fs.existsSync(dicPath)) {
    log(`Warning: Dictionary for locale ${locale} not implemented yet`);
    return false;
  }
  try {
    dictionary = JSON.parse(fs.readFileSync(dicPath, 'utf8'));
    return true;
  } catch (error) {
    log(`Error: Failed to parse dictionary file for locale ${locale}: ${error}`);
    return false;
  }
}

export function init() {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  if (locale.slice(0, 2) === 'en' || loaded) {
    return;
  }
  loaded = loadDictionary(locale);
}

export function t(key: string): string {
  return loaded && dictionary[key] !== undefined ? dictionary[key] : key;
}
