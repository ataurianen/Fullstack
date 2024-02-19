/* eslint-disable react/prop-types */
const Person = ({ name, number, id, onDeleteClick }) => {
  return (
    <p>
      {name} {number}
      <button onClick={() => onDeleteClick(id)}>Delete</button>
    </p>
  );
};

export default Person;
