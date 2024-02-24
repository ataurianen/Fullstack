import Weather from './Weather';
/* eslint-disable react/prop-types */

const Country = ({ country }) => {
  const languageList = Object.values(country.languages).map((language) => {
    return <li key={language}>{language}</li>;
  });

  return (
    <>
      <h2>{country.name.common}</h2>
      <br />
      <p>{`Captial: ${country.capital}`}</p>
      <p>{`Area: ${country.area}`}</p>
      <br />
      <h3>Languages:</h3>
      <ul>{languageList}</ul>
      <img src={country.flags.png} />
      <Weather country={country} />
    </>
  );
};

export default Country;
