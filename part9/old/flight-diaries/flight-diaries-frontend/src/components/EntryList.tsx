import { EntryListProps } from '../types';
import Entry from './Entry';

const EntryList = (props: EntryListProps) => {
  return (
    <>
      {props.entries.map((entry) => (
        <Entry key={entry.id} entry={entry} />
      ))}
    </>
  );
};

export default EntryList;
