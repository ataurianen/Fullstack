/* eslint-disable react/prop-types */

import Person from './Person';

const Persons = ({ persons, filter, onDeleteClick }) => {
  const listOfPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
  console.log(listOfPeople);
  return (
    <div>
      {listOfPeople.map((person) => (
        <Person
          key={person.name}
          name={person.name}
          number={person.number}
          id={person.id}
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default Persons;
