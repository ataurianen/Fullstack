/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Header from './components/Header';
import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (e) => {
    e.preventDefault();
    if (persons.some((e) => e.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const personObject = {
        name: newName,
        number: newPhoneNumber,
      };

      personService.create(personObject).then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
      });
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

  const handleDeleteClick = (id) => {
    const person = persons.find((person) => person.id === id);
    console.log(person);
    if (window.confirm(`Do you really want to delete ${person.name}?`)) {
      personService.deleteEntry(id).then(() => {
        setPersons(
          persons.filter((person) => {
            return person.id !== id;
          })
        );
      });
    }
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

      <Persons
        persons={persons}
        filter={filter}
        onDeleteClick={handleDeleteClick}
      />
    </div>
  );
};

export default App;
