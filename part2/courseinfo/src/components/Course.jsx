/* eslint-disable react/prop-types */
const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    return (sum += part.exercises);
  }, 0);
  return (
    <p>
      <strong>Total number of exercises {total}</strong>
    </p>
  );
};

const Part = (props) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      ))}
    </div>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      {courses.map((course) => {
        return (
          <div key={course.id}>
            <Header text={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        );
      })}
    </>
  );
};

export default Course;
