import { useState } from 'react';
import PropTypes from 'prop-types';

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username, password);
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        Username:
        <input
          data-testid='username'
          type='text'
          value={username}
          name='Username'
          onChange={handleUsernameInputChange}
        />
      </div>
      <div>
        Password:
        <input
          data-testid='password'
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

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
