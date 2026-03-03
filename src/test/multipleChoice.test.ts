import { describe, expect, it } from 'vitest';
import { buildMeaningChoices } from '../lib/multipleChoice';

const items = [
  { id: '1', term: 'uno', meaning: 'one' },
  { id: '2', term: 'dos', meaning: 'two' },
  { id: '3', term: 'tres', meaning: 'three' },
  { id: '4', term: 'cuatro', meaning: 'four' },
  { id: '5', term: 'cinco', meaning: 'five' },
];

describe('buildMeaningChoices', () => {
  it('returns four options containing the correct meaning', () => {
    const options = buildMeaningChoices(items[0], items, 4);
    expect(options).toHaveLength(4);
    expect(options).toContain('one');
  });
});
