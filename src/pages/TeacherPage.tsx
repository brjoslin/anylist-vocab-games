import { useMemo, useState } from 'react';
import type { AppState } from '../App';
import { parsePastedList, toTsv } from '../lib/parser';
import { makeId } from '../lib/id';
import type { WordList } from '../types';

type Props = { state: AppState };

export const TeacherPage = ({ state }: Props) => {
  const [name, setName] = useState('Spanish Basics');
  const [languageTag, setLanguageTag] = useState('es-ES');
  const [pasteText, setPasteText] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const selected = useMemo(
    () => state.lists.find((list) => list.id === selectedId),
    [selectedId, state.lists]
  );

  const createList = () => {
    if (!name.trim()) return;
    const list: WordList = { id: makeId(), name: name.trim(), languageTag, items: [] };
    state.setLists([list, ...state.lists]);
    setSelectedId(list.id);
  };

  const importIntoSelected = () => {
    if (!selected) return;
    const parsed = parsePastedList(pasteText);
    const next = state.lists.map((list) =>
      list.id === selected.id ? { ...list, items: parsed } : list
    );
    state.setLists(next);
  };

  const removeList = (id: string) => {
    state.setLists(state.lists.filter((list) => list.id !== id));
    if (selectedId === id) setSelectedId('');
  };

  const renameList = (id: string) => {
    const current = state.lists.find((list) => list.id === id);
    if (!current) return;
    const nextName = window.prompt('Rename list', current.name);
    if (!nextName || !nextName.trim()) return;
    state.setLists(
      state.lists.map((list) =>
        list.id === id ? { ...list, name: nextName.trim() } : list
      )
    );
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>Create list</h2>
        <label>
          List name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Language tag (for speech voice)
          <input value={languageTag} onChange={(e) => setLanguageTag(e.target.value)} />
        </label>
        <button onClick={createList}>Create</button>
      </section>

      <section className="card">
        <h2>Manage lists</h2>
        {state.lists.length === 0 ? (
          <p>No lists yet.</p>
        ) : (
          <ul>
            {state.lists.map((list) => (
              <li key={list.id}>
                <button className="linkish" onClick={() => setSelectedId(list.id)}>
                  {list.name}
                </button>{' '}
                ({list.items.length} items)
                <button onClick={() => renameList(list.id)}>Rename</button>
                <button onClick={() => removeList(list.id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Import / Export (paste text)</h2>
        {!selected ? (
          <p>Select a list above first.</p>
        ) : (
          <>
            <p>
              Editing: <strong>{selected.name}</strong>
            </p>
            <p>Accepted formats: one term per line OR term[TAB]meaning OR term,meaning.</p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={10}
              placeholder={'hola\thello\nperro,dog\nlibro'}
            />
            <div className="row gap">
              <button onClick={importIntoSelected}>Import from text</button>
              <button onClick={() => setPasteText(toTsv(selected.items))}>Load TSV for export</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};
