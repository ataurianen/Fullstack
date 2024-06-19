import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

const BirthYear = () => {
  const [year, setYear] = useState('');
  const [name, setName] = useState('');

  const [updateAuthor, result] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      alert('Author not found');
    }
  }, [result.data]); // eslint-disable-line

  const submit = async (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name, setBornTo: Number(year) } });
    setName('');
    setYear('');
  };

  return (
    <div>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name{' '}
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born{' '}
          <input
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <div>
          <button type='submit'>update author</button>
        </div>
      </form>
    </div>
  );
};
export default BirthYear;
