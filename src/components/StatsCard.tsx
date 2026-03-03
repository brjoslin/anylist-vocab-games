import type { SessionStats } from '../types';

type Props = { stats: SessionStats };

export const StatsCard = ({ stats }: Props) => {
  const total = stats.correct + stats.incorrect;
  const accuracy = total === 0 ? 0 : Math.round((stats.correct / total) * 100);

  return (
    <section className="card">
      <h3>Session Stats</h3>
      <p>Correct: {stats.correct}</p>
      <p>Incorrect: {stats.incorrect}</p>
      <p>Accuracy: {accuracy}%</p>
      {stats.missedTerms.length > 0 && (
        <>
          <h4>Missed terms</h4>
          <ul>
            {stats.missedTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
};
