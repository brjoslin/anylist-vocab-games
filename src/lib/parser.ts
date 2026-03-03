import { makeId } from './id';
import type { VocabItem } from '../types';

const splitLine = (line: string): [string, string?] => {
  if (line.includes('\t')) {
    const [term, ...rest] = line.split('\t');
    return [term, rest.join('\t')];
  }

  if (line.includes(',')) {
    const [term, ...rest] = line.split(',');
    return [term, rest.join(',')];
  }

  return [line];
};

export const parsePastedList = (raw: string): VocabItem[] => {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [termRaw, meaningRaw] = splitLine(line);
      const term = termRaw?.trim() ?? '';
      const meaning = meaningRaw?.trim() || undefined;

      return {
        id: makeId(),
        term,
        meaning,
      } satisfies VocabItem;
    })
    .filter((item) => item.term.length > 0);
};

export const toTsv = (items: VocabItem[]) =>
  items
    .map((item) => `${item.term}\t${item.meaning ?? ''}`)
    .join('\n');
