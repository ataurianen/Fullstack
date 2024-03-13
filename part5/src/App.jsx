import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/loginForm';
import BlogDisplay from './components/Blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      console.log('Wrong credentials');
    }
  };

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div>
      {user === null ? (
        <LoginForm
          valueUsername={username}
          valuePassword={password}
          onChangeUsername={handleUsernameInputChange}
          onChangePassword={handlePasswordInputChange}
          onSubmit={handleLogin}
        />
      ) : (
        <BlogDisplay user={user} blogs={blogs} />
      )}
    </div>
  );
};

export default App;
