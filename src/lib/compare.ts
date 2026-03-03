const normalizeInput = (value: string) => value.trim().toLowerCase();

const stripDiacritics = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const isAnswerCorrect = (
  answer: string,
  expected: string,
  strictDiacritics: boolean
) => {
  const a = normalizeInput(answer);
  const e = normalizeInput(expected);

  if (strictDiacritics) {
    return a === e;
  }

  return stripDiacritics(a) === stripDiacritics(e);
};
