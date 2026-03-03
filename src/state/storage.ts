import type { AppSettings, WordList } from '../types';

const LISTS_KEY = 'anylist.vocab.lists.v1';
const SETTINGS_KEY = 'anylist.vocab.settings.v1';

const defaultSettings: AppSettings = {
  strictDiacritics: false,
};

export const loadLists = (): WordList[] => {
  try {
    const raw = localStorage.getItem(LISTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as WordList[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveLists = (lists: WordList[]) => {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw) as AppSettings;
    return {
      ...defaultSettings,
      ...parsed,
    };
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
