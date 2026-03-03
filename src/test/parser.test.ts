import { describe, expect, it } from 'vitest';
import { parsePastedList } from '../lib/parser';

describe('parsePastedList', () => {
  it('parses term-only rows', () => {
    const result = parsePastedList('hola\nadiós');
    expect(result).toHaveLength(2);
    expect(result[0].term).toBe('hola');
    expect(result[0].meaning).toBeUndefined();
  });

  it('parses tab or comma separated rows', () => {
    const result = parsePastedList('perro\tdog\nlibro,book');
    expect(result[0].meaning).toBe('dog');
    expect(result[1].meaning).toBe('book');
  });
});
