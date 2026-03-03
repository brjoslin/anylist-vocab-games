import type { AppSettings } from '../types';

type Props = {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
};

export const SettingsPanel = ({ settings, onChange }: Props) => {
  return (
    <section className="card">
      <h2>Practice Settings</h2>
      <label className="row">
        <input
          type="checkbox"
          checked={settings.strictDiacritics}
          onChange={(e) =>
            onChange({ ...settings, strictDiacritics: e.target.checked })
          }
        />
        Strict accents/diacritics
      </label>
    </section>
  );
};
