/* eslint-disable react/prop-types */
const CountryList = ({ name, setFilter }) => {
  return (
    <p>
      {name} <button onClick={() => setFilter(name)}>show</button>
    </p>
  );
};

export default CountryList;
