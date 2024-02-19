/* eslint-disable react/prop-types */
import { useState } from 'react';

const Header = ({ text }) => {
  return <h2>{text}</h2>;
};

const Person = ({ name, number }) => {
  return (
    <p>
      {name} {number}
    </p>
  );
};

const People = ({ persons, filter }) => {
  const listOfPeople = persons.filter((person) => person.name.includes(filter));
  return (
    <div>
      {listOfPeople.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((e) => e.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newPhoneNumber,
      };

      setPersons(persons.concat(personObject));
    }

    setNewName('');
    setNewPhoneNumber('');
  };

  const handleNameInputChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberInputChange = (e) => {
    setNewPhoneNumber(e.target.value);
  };

  const handleFilterInputChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <Header text={'Phonebook'} />
      <div>
        Filter shown with{' '}
        <input value={filter} onChange={handleFilterInputChange} />
      </div>
      <Header text={'Add a new person:'} />
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleNameInputChange} />
        </div>
        <div>
          Number:{' '}
          <input value={newPhoneNumber} onChange={handleNumberInputChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <Header text={'Numbers'} />
      <People persons={persons} filter={filter} />
    </div>
  );
};

export default App;
