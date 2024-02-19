/* eslint-disable react/prop-types */
const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        Name: <input value={props.valueName} onChange={props.onChangeName} />
      </div>
      <div>
        Number:{' '}
        <input value={props.valuePhone} onChange={props.onChangePhone} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  );
};

export default PersonForm;
