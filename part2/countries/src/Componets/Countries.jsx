/* eslint-disable react/prop-types */
import Country from './Country';
import CountryList from './CountryList';

const Countries = ({ list, setFilter }) => {
  if (list) {
    if (list.length > 10) {
      return <p>Too many matches, specify another filter</p>;
    } else if (list.length > 1) {
      return (
        <div>
          {list.map((country, index) => {
            return (
              <CountryList
                key={index}
                name={country.name.common}
                setFilter={setFilter}
              />
            );
          })}
        </div>
      );
    } else {
      return (
        <>
          <Country key={list[0]} country={list[0]} />
        </>
      );
    }
  }
};

export default Countries;
