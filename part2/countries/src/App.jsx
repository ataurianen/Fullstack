import { useState } from 'react';

function App() {
  const [country, setCountry] = useState('');

  const handleInputChange = (e) => {
    setCountry(e.target.value);
  };

  return (
    <>
      find countries: <input value={country} onChange={handleInputChange} />
    </>
  );
}

export default App;
