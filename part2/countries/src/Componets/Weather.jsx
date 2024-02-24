/* eslint-disable react/prop-types */
import axios from 'axios';
import { useState, useEffect } from 'react';

const Weather = ({ country }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const api_key = import.meta.env.VITE_WEATHER_API_KEY;
  const lat = country.capitalInfo.latlng[0];
  const lon = country.capitalInfo.latlng[1];

  const baseURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;

  useEffect(() => {
    axios.get(baseURL).then((response) => setCurrentWeather(response.data));
  }, []);

  if (!currentWeather) {
    return null;
  }

  return (
    <>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {currentWeather.main.temp} Celcius</p>
      <img
        src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
      />
      <p>Wind: {currentWeather.wind.speed} m/s</p>
    </>
  );
};

export default Weather;
