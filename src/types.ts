export type VocabItem = {
  id: string;
  term: string;
  meaning?: string;
  notes?: string;
};

export type WordList = {
  id: string;
  name: string;
  languageTag: string;
  items: VocabItem[];
};

export type GameMode = 'listen-spell' | 'meaning-spell' | 'hear-choose';

export type AppSettings = {
  strictDiacritics: boolean;
};

export type SessionStats = {
  correct: number;
  incorrect: number;
  missedTerms: string[];
};
