/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR, ALL_AUTHORS } from '../queries';

import Select from 'react-select';

const BirthYear = ({ authors }) => {
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
          <Select
            value={name}
            onChange={(option) => setName(option.value)}
            options={authors.map((author) => ({
              value: author.name,
              label: author.name,
            }))}
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
