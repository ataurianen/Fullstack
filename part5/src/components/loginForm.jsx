const LoginForm = (props) => (
  <form onSubmit={props.onSubmit}>
    <div>
      Username:
      <input
        type='text'
        value={props.valueUsername}
        name='Username'
        onChange={props.onChangeUsername}
      />
    </div>
    <div>
      Password:
      <input
        type='password'
        value={props.valuePassword}
        name='password'
        onChange={props.onChangePassword}
      />
    </div>
    <button type='submit'>Login</button>
  </form>
);

export default LoginForm;
