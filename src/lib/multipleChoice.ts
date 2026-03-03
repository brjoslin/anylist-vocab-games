import type { VocabItem } from '../types';

export const buildMeaningChoices = (
  correctItem: VocabItem,
  allItems: VocabItem[],
  total = 4
): string[] => {
  if (!correctItem.meaning) {
    return [];
  }

  const distractors = allItems
    .filter((item) => item.id !== correctItem.id && item.meaning)
    .map((item) => item.meaning as string)
    .filter((meaning, index, arr) => arr.indexOf(meaning) === index);

  for (let i = distractors.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [distractors[i], distractors[j]] = [distractors[j], distractors[i]];
  }

  const options = [correctItem.meaning, ...distractors.slice(0, total - 1)];

  for (let i = options.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
};
