import { useState } from 'react';

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={submitLogin}>
      <div>
        Username:
        <input
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameInputChange}
        />
      </div>
      <div>
        Password:
        <input
          type='password'
          value={password}
          name='password'
          onChange={handlePasswordInputChange}
        />
      </div>
      <button type='submit'>Login</button>
    </form>
  );
};

export default LoginForm;
