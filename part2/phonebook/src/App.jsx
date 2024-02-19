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
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (e) => {
    const nameList = persons.map((person) => person.name);

    e.preventDefault();

    if (nameList.includes(newName)) {
      const currentPerson = persons.find((person) => person.name === newName);
      const updatedCurrentPerson = { ...currentPerson, number: newPhoneNumber };

      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(currentPerson.id, updatedCurrentPerson)
          .then((returnedList) => {
            setPersons(
              persons.map((person) =>
                person.id !== currentPerson.id ? person : returnedList
              )
            );
            showNotification(`Updated ${newName}'s phone number`);
            setNewName('');
            setNewPhoneNumber('');
          })
          .catch(() => {
            showNotification(
              `Information of ${currentPerson.name} has already been removed from server`
            );
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newPhoneNumber,
      };

      personService.create(personObject).then((returnedPersons) => {
        setPersons(persons.concat(returnedPersons));
        showNotification(`Added ${newName}`);
        setNewName('');
        setNewPhoneNumber('');
      });
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
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
      personService
        .deleteEntry(id)
        .then(() => {
          setPersons(
            persons.filter((person) => {
              return person.id !== id;
            })
          );
        })
        .catch(() => {
          showNotification(
            `Information of ${person.name} has already been removed from the server`
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
