import { TotalProps } from '../types';

const Total = (props: TotalProps) => {
  return (
    <div>
      <h2>Number of exercises: {props.totalExercises}</h2>
    </div>
  );
};

export default Total;
