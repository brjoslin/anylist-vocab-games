import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { AppState } from '../App';
import type { GameMode, SessionStats, VocabItem } from '../types';
import { isAnswerCorrect } from '../lib/compare';
import { buildMeaningChoices } from '../lib/multipleChoice';
import { getSpeechVoices, speakText } from '../lib/speech';

const shuffle = <T,>(arr: T[]) => {
  const next = [...arr];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

type Props = { state: AppState };

export const GamePage = ({ state }: Props) => {
  const params = useParams();
  const mode = params.mode as GameMode;
  const list = state.lists.find((entry) => entry.id === params.listId);
  const baseItems = useMemo(() => {
    if (!list) return [];
    if (mode === 'listen-spell') return list.items;
    return list.items.filter((item) => item.meaning);
  }, [list, mode]);

  const [queue, setQueue] = useState<VocabItem[]>(() => shuffle(baseItems));
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attemptedWrong, setAttemptedWrong] = useState(false);
  const [voiceURI, setVoiceURI] = useState<string>();
  const [rate, setRate] = useState(1);
  const [stats, setStats] = useState<SessionStats>({
    correct: 0,
    incorrect: 0,
    missedTerms: [],
  });

  const current = queue[0];

  if (!list) {
    return <p>List not found. <Link to="/">Back home</Link></p>;
  }

  if (!mode || !['listen-spell', 'meaning-spell', 'hear-choose'].includes(mode)) {
    return <p>Mode not found.</p>;
  }

  if (baseItems.length === 0) {
    return <p>This mode needs items with meanings. <Link to="/">Choose another mode</Link>.</p>;
  }

  const nextQuestion = () => {
    const rest = queue.slice(1);
    if (rest.length === 0) {
      setQueue(shuffle(baseItems));
    } else {
      setQueue(rest);
    }
    setAnswer('');
    setFeedback('');
    setAttemptedWrong(false);
  };

  const markIncorrect = () => {
    setStats((prev) => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      missedTerms: prev.missedTerms.includes(current.term)
        ? prev.missedTerms
        : [...prev.missedTerms, current.term],
    }));
  };

  const submitSpelling = () => {
    const correct = isAnswerCorrect(answer, current.term, state.settings.strictDiacritics);
    if (correct) {
      setFeedback('✅ Correct');
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setTimeout(nextQuestion, 600);
      return;
    }

    if (!attemptedWrong) {
      markIncorrect();
      setAttemptedWrong(true);
      setFeedback('❌ Incorrect. Try once more.');
      return;
    }

    setFeedback(`❌ Incorrect. Correct answer: ${current.term}`);
    setTimeout(nextQuestion, 1100);
  };

  const onChoice = (choice: string) => {
    const good = choice === current.meaning;
    if (good) {
      setFeedback('✅ Correct');
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      setTimeout(nextQuestion, 600);
    } else {
      setFeedback(`❌ Incorrect. Correct answer: ${current.meaning}`);
      markIncorrect();
      setTimeout(nextQuestion, 1000);
    }
  };

  const voices = getSpeechVoices().filter((voice) =>
    voice.lang.toLowerCase().startsWith(list.languageTag.toLowerCase().slice(0, 2))
  );

  const choices = mode === 'hear-choose' ? buildMeaningChoices(current, baseItems, 4) : [];
  const notEnoughChoices = mode === 'hear-choose' && choices.length < 4;

  return (
    <div className="stack">
      <section className="card">
        <h2>{list.name}</h2>
        <p>Mode: {mode}</p>
        <p>Remaining in cycle: {queue.length}</p>
        {(mode === 'listen-spell' || mode === 'hear-choose') && (
          <div className="stack-sm">
            <button onClick={() => speakText(current.term, voiceURI, list.languageTag, rate)}>
              Play / Replay
            </button>
            <label>
              Speech rate: {rate.toFixed(1)}
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
            <label>
              Voice
              <select value={voiceURI} onChange={(e) => setVoiceURI(e.target.value || undefined)}>
                <option value="">Default</option>
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {mode === 'meaning-spell' && <p className="prompt">Meaning: {current.meaning}</p>}

        {(mode === 'listen-spell' || mode === 'meaning-spell') && (
          <div className="row gap">
            <input
              aria-label="Type your answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type the term"
            />
            <button onClick={submitSpelling}>Submit</button>
          </div>
        )}

        {mode === 'hear-choose' && (
          <>
            {notEnoughChoices ? (
              <p>Add at least 4 items with meanings to use multiple choice mode.</p>
            ) : (
              <div className="mode-grid">
                {choices.map((choice) => (
                  <button key={choice} onClick={() => onChoice(choice)}>
                    {choice}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {feedback && <p role="status">{feedback}</p>}
      </section>

      <section className="card">
        <h3>Tips</h3>
        <p>Press Play before every answer for listening modes.</p>
        <p>
          Strict accents is currently <strong>{state.settings.strictDiacritics ? 'ON' : 'OFF'}</strong>.
        </p>
        <p><Link to="/">Back home</Link></p>
      </section>

      <section className="card">
        <h3>Session Stats</h3>
        <p>Correct: {stats.correct}</p>
        <p>Incorrect: {stats.incorrect}</p>
        <p>
          Accuracy:{' '}
          {stats.correct + stats.incorrect === 0
            ? '0%'
            : `${Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)}%`}
        </p>
        {stats.missedTerms.length > 0 && (
          <ul>
            {stats.missedTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};
