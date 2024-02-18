/* eslint-disable react/prop-types */
import { useState } from 'react';

const Header = ({ text }) => {
  return <h2>{text}</h2>;
};

const Person = ({ name }) => {
  return <p>{name}</p>;
};

const People = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.name} name={person.name} />
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas' }]);
  const [newName, setNewName] = useState('');

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((e) => e.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
      };

      setPersons(persons.concat(personObject));
    }

    setNewName('');
  };

  const handleInputChange = (e) => {
    setNewName(e.target.value);
  };

  return (
    <div>
      <Header text={'Phonebook'} />
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
      <Header text={'Numbers'} />
      <People persons={persons} />
    </div>
  );
};

export default App;
