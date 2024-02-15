/* eslint-disable react/prop-types */
import { useState } from 'react';

const Display = ({ text }) => {
  return (
    <>
      <p>{text}</p>
    </>
  );
};

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState('');

  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  const handleOnClick = () => {
    setSelected(anecdotes[getRandomInt(0, anecdotes.length)]);
  };

  return (
    <div>
      <div>
        <Display text={selected} />
      </div>
      <div>
        <Button onClick={handleOnClick} text='next ancedote' />
      </div>
    </div>
  );
};

export default App;
