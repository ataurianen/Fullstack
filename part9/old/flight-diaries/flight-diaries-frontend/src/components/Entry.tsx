import { EntryProps } from '../types';

const Entry = (props: EntryProps) => {
  const entry = props.entry;

  return (
    <div>
      <h2>{entry.date}</h2>
      <p>visibility: {entry.visibility}</p>
      <p>weather: {entry.weather}</p>
    </div>
  );
};
export default Entry;
