import { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TeacherPage } from './pages/TeacherPage';
import { GamePage } from './pages/GamePage';
import type { AppSettings, WordList } from './types';
import { loadLists, loadSettings, saveLists, saveSettings } from './state/storage';

type AppState = {
  lists: WordList[];
  settings: AppSettings;
  setLists: (lists: WordList[]) => void;
  setSettings: (settings: AppSettings) => void;
};

export const App = () => {
  const [lists, updateLists] = useState<WordList[]>(() => loadLists());
  const [settings, updateSettings] = useState<AppSettings>(() => loadSettings());

  const setLists = (next: WordList[]) => {
    updateLists(next);
    saveLists(next);
  };

  const setSettings = (next: AppSettings) => {
    updateSettings(next);
    saveSettings(next);
  };

  const state = useMemo<AppState>(
    () => ({ lists, settings, setLists, setSettings }),
    [lists, settings]
  );

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage state={state} />} />
        <Route path="/teacher" element={<TeacherPage state={state} />} />
        <Route path="/game/:listId/:mode" element={<GamePage state={state} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export type { AppState };
