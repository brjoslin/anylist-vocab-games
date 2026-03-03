import { describe, expect, it } from 'vitest';
import { isAnswerCorrect } from '../lib/compare';

describe('isAnswerCorrect', () => {
  it('ignores case and whitespace', () => {
    expect(isAnswerCorrect('  HOLA ', 'hola', true)).toBe(true);
  });

  it('can ignore diacritics when strict is off', () => {
    expect(isAnswerCorrect('cancion', 'canción', false)).toBe(true);
  });

  it('requires exact accents when strict is on', () => {
    expect(isAnswerCorrect('cancion', 'canción', true)).toBe(false);
  });
});
