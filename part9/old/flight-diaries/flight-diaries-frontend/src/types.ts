export interface HeaderProps {
  text: string;
}

export interface EntryListProps {
  entries: DiaryEntry[];
}

export interface EntryProps {
  entry: DiaryEntry;
}

export interface DiaryEntry {
  id: number;
  date: string;
  visibility: string;
  weather: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
