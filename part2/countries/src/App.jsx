import { useState, useEffect } from 'react';
import countriesService from './services/countries';
import Countries from './Componets/Countries';

function App() {
  const [countries, setCountries] = useState(null);
  const [filteredCountry, setFilteredCountry] = useState('');

  useEffect(() => {
    countriesService.getAll().then((countriesList) => {
      setCountries(countriesList);
    });
  }, []);

  const handleInputChange = (e) => {
    setFilteredCountry(e.target.value);
  };

  const setFilter = (country) => {
    setFilteredCountry(country);
  };

  if (!countries) {
    return null;
  }

  const filteredCountryList = countries.filter((country) => {
    return country.name.common
      .toLowerCase()
      .includes(filteredCountry.toLocaleLowerCase());
  });

  return (
    <div>
      <p>
        Find countries:{' '}
        <input value={filteredCountry} onChange={handleInputChange} />
      </p>
      <Countries list={filteredCountryList} setFilter={setFilter} />
    </div>
  );
}

export default App;
