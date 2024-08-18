import { useEffect, useState } from 'react';
import Header from './components/Header';
import EntryList from './components/EntryList';
import NewEntry from './components/NewEntry';
import { DiaryEntry } from './types';
import { getAllDiaries } from './diaryService';

function App() {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then((entries) => setEntries(entries));
  }, []);
  return (
    <>
      <Header text='Add New Entry' />
      <NewEntry />
      <Header text='Diary Entries' />
      <EntryList entries={entries} />
    </>
  );
}

export default App;
