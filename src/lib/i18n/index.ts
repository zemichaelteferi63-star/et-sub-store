import { en } from './en';
import { am } from './am';

export type Language = 'en' | 'am';
export type Dictionary = typeof en;

export const dictionaries: Record<Language, Dictionary> = {
  en,
  am,
};

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] || dictionaries.en;
}
