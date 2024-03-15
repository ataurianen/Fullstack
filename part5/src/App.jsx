import { useState, useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/loginForm';
import BlogDisplay from './components/Blogs';
import NewBlogForm from './components/NewBlogForm';
import Header from './components/Header';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogURL, setBlogURL] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sucessMessage, setSucessMessage] = useState(null);

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

  const handleBlogTitleInputChange = (e) => {
    setBlogTitle(e.target.value);
  };

  const handleBlogAuthorInputChange = (e) => {
    setBlogAuthor(e.target.value);
  };

  const handleBlogURLInputChange = (e) => {
    setBlogURL(e.target.value);
  };

  const handleNewBlogSubmit = async (e) => {
    e.preventDefault();
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
      user: user,
    };

    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog));
    setSucessMessage(`A new blog: ${blogTitle} by ${blogAuthor} added`);
    setTimeout(() => {
      setSucessMessage(null);
    }, 5000);

    setBlogTitle('');
    setBlogAuthor('');
    setBlogURL('');
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
          <Notification className='sucess' message={sucessMessage} />
          <p>
            {user.name} logged in{' '}
            <button onClick={handleLogoutClick}>logout</button>
          </p>
          <Header text={'Create New'} />
          <NewBlogForm
            valueBlogTitle={blogTitle}
            valueBlogAuthor={blogAuthor}
            valueBlogURL={blogURL}
            onChangeBlogTitle={handleBlogTitleInputChange}
            onChangeBlogAuthor={handleBlogAuthorInputChange}
            onChangeBlogURL={handleBlogURLInputChange}
            onSubmit={handleNewBlogSubmit}
          />
          <BlogDisplay user={user} blogs={blogs} />
        </div>
      )}
    </div>
  );
};

export default App;
