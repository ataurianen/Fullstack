/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Header from './components/Header';
import phonebookService from './services/phonebooks';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
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

      phonebookService.create(personObject).then((returnedPersons) => {
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
