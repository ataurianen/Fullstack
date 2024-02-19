/* eslint-disable react/prop-types */

import Person from './Person';

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

export default Persons;
