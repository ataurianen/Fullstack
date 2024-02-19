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

const Persons = ({ persons, filter }) => {
  const listOfPeople = persons.filter((person) => person.name.includes(filter));
  return (
    <div>
      {listOfPeople.map((person) => (
        <Person key={person.name} name={person.name} number={person.number} />
      ))}
    </div>
  );
};

const Filter = ({ filter, onChange }) => {
  return (
    <div>
      Filter shown with
      <input value={filter} onChange={onChange} />
    </div>
  );
};

const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        Name: <input value={props.valueName} onChange={props.onChangeName} />
      </div>
      <div>
        Number:{' '}
        <input value={props.valuePhone} onChange={props.onChangePhone} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
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

      <Filter filter={filter} onChange={handleFilterInputChange} />

      <Header text={'Add a new person:'} />

      <PersonForm
        valueName={newName}
        valuePhone={newPhoneNumber}
        onChangeName={handleNameInputChange}
        onChangePhone={handleNumberInputChange}
        onSubmit={addPerson}
      />

      <Header text={'Numbers'} />

      <Persons persons={persons} filter={filter} />
    </div>
  );
};

export default App;
