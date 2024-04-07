import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/loginForm';
import BlogDisplay from './components/Blogs';
import NewBlogForm from './components/NewBlogForm';
import Header from './components/Header';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const Notification = ({ message, className }) => {
    if (message === null) {
      return null;
    }

    return <div className={className}>{message}</div>;
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      setErrorMessage(`Wrong username or password`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleUsernameInputChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogoutClick = (e) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const handleViewClick = (e) => {
    console.log('button clicked');
  };

  const addBlog = async (blogObject) => {
    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog));
  };

  return (
    <div>
      {user === null ? (
        <>
          <Header text={'Log in to application'} />
          <Notification className='error' message={errorMessage} />
          <LoginForm
            valueUsername={username}
            valuePassword={password}
            onChangeUsername={handleUsernameInputChange}
            onChangePassword={handlePasswordInputChange}
            onSubmit={handleLogin}
          />
        </>
      ) : (
        <div>
          <Header text={'Blogs'} />
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogoutClick}>logout</button>
          </p>
          <Togglable buttonLabel='New Blog'>
            <NewBlogForm createBlog={addBlog} />
          </Togglable>

          <BlogDisplay user={user} blogs={blogs} onClick={handleViewClick} />
        </div>
      )}
    </div>
  );
};

export default App;
