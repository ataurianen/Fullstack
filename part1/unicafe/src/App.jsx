/* eslint-disable react/prop-types */
import { useState } from 'react';

const Header = ({ text }) => {
  return (
    <div>
      <h1>{text}</h1>
    </div>
  );
};

const Button = ({ onClick, text }) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  );
};

const StatisticLine = ({ text, value }) => {
  return (
    <>
      <tr>
        <td>{text}</td>
        <td>{value}</td>
      </tr>
    </>
  );
};

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    );
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text='good:' value={props.good} />
          <StatisticLine text='neutral:' value={props.neutral} />
          <StatisticLine text='bad:' value={props.bad} />
          <StatisticLine text='average:' value={props.average} />
          <StatisticLine text='positive:' value={props.good / props.total} />
        </tbody>
      </table>
    );
  }
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
    setAverage(average + 1);
    setTotal(total + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    setAverage(average + 0);
    setTotal(total + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
    setAverage(average - 1);
    setTotal(total + 1);
  };

  return (
    <div>
      <Header text='Give Feedback' />
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />
      <Header text='statistics' />
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        total={total}
        average={average}
      />
    </div>
  );
};

export default App;
