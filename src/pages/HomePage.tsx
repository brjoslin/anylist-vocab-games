import { Link } from 'react-router-dom';
import { SettingsPanel } from '../components/SettingsPanel';
import type { AppState } from '../App';

const modes = [
  { id: 'listen-spell', label: '1) Listen & Spell', needsMeaning: false },
  { id: 'meaning-spell', label: '2) See Meaning → Spell Target', needsMeaning: true },
  { id: 'hear-choose', label: '3) Hear Target → Choose Meaning', needsMeaning: true },
] as const;

type Props = { state: AppState };

export const HomePage = ({ state }: Props) => {
  return (
    <div className="stack">
      <section className="card">
        <h2>Choose a list and start practicing</h2>
        {state.lists.length === 0 ? (
          <p>
            No lists yet. Go to <Link to="/teacher">Teacher Area</Link> to add your
            first list.
          </p>
        ) : (
          state.lists.map((list) => {
            const withMeaning = list.items.filter((item) => item.meaning).length;
            return (
              <article key={list.id} className="list-card">
                <h3>{list.name}</h3>
                <p>
                  {list.items.length} terms • language: <code>{list.languageTag}</code>
                </p>
                <div className="mode-grid">
                  {modes.map((mode) => {
                    const disabled = mode.needsMeaning && withMeaning === 0;
                    return disabled ? (
                      <span key={mode.id} className="pill disabled">
                        {mode.label} (needs meanings)
                      </span>
                    ) : (
                      <Link key={mode.id} className="pill" to={`/game/${list.id}/${mode.id}`}>
                        {mode.label}
                      </Link>
                    );
                  })}
                </div>
              </article>
            );
          })
        )}
      </section>
      <SettingsPanel settings={state.settings} onChange={state.setSettings} />
    </div>
  );
};
