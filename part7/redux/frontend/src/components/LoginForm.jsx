import { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField, Button } from '@mui/material';

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
        <TextField
          type='text'
          label='username'
          data-testid='username'
          size='small'
          value={username}
          onChange={handleUsernameInputChange}
        />
      </div>
      <div>
        <TextField
          type='password'
          data-testid='password'
          size='small'
          label='password'
          value={password}
          onChange={handlePasswordInputChange}
        />
      </div>
      <Button variant='contained' color='primary' type='submit'>
        Login
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
