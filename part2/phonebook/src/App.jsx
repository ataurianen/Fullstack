/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Persons from './components/Persons';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Header from './components/Header';
import personService from './services/persons';

const Notification = ({ message, className }) => {
  if (message === null) {
    return null;
  }

  return <div className={className}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [sucessMessage, setSucessMessage] = useState(null);

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
            setSucessMessage(`Updated ${newName}'s phone number`);
            setTimeout(() => {
              setSucessMessage(null);
            }, 5000);
            setNewName('');
            setNewPhoneNumber('');
          })
          .catch(() => {
            setErrorMessage(
              `Information of ${currentPerson.name} has already been removed from server`
            );
            setPersons(
              persons.filter((person) => person.id !== currentPerson.id)
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newPhoneNumber,
      };

      personService
        .create(personObject)
        .then((returnedPersons) => {
          setPersons(persons.concat(returnedPersons));
          setSucessMessage(`Added ${newName}`);
          setTimeout(() => {
            setSucessMessage(null);
          }, 5000);
          setNewName('');
          setNewPhoneNumber('');
        })
        .catch((error) => {
          console.log(error.response.data.error);
          setErrorMessage(error.response.data.error);
        });
    }
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
          setErrorMessage(
            `Information of ${person.name} has already been removed from the server`
          );
          setPersons(persons.filter((p) => p.id !== person.id));
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <Header text={'Phonebook'} />

      <Notification className='error' message={errorMessage} />
      <Notification className='sucess' message={sucessMessage} />

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
