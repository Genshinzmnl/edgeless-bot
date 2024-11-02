import fs from 'fs';
import { PROJECT_ROOT } from '../src/const';
import path from 'path';
import { log } from '../src/utils';

// 定义翻译字典的接口
interface TranslationDictionary {
  [key: string]: string;
}

// 初始化翻译字典和加载状态
let translationDictionary: TranslationDictionary = {};
let isLoaded: boolean = false;

// 加载翻译字典的函数
function loadTranslationDictionary(locale: string): boolean {
  try {
    const dictionaryPath = path.join(PROJECT_ROOT, 'i18n', `${locale}.json`);
    if (!fs.existsSync(dictionaryPath)) {
      log(`Warning: Dictionary for locale ${locale} not implemented yet`);
      return false;
    }
    // 读取并解析 JSON 文件
    const rawDictionary = fs.readFileSync(dictionaryPath, 'utf8');
    translationDictionary = JSON.parse(rawDictionary);
    return true;
  } catch (error) {
    log(`Error: Failed to load or parse dictionary file for locale ${locale}: ${error}`);
    return false;
  }
}

// 初始化函数，根据当前环境的语言设置加载相应的翻译字典
export function initTranslation(): void {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  // 如果语言环境为英文或字典已加载，则不进行操作
  if (locale.startsWith('en') || isLoaded) {
    return;
  }
  isLoaded = loadTranslationDictionary(locale);
}

// 翻译函数，根据提供的英文键返回对应的翻译
export function translate(key: string): string {
  if (isLoaded && translationDictionary.hasOwnProperty(key)) {
    return translationDictionary[key];
  }
  return key;
}
