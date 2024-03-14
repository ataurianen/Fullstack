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
      console.log('Wrong credentials');
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

  const handleNewBlogSubmit = (e) => {
    e.preventDefault();
    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
      user: user,
    };
    try {
      blogService.create(blogObject);
      setBlogTitle('');
      setBlogAuthor('');
      setBlogURL('');
      blogService.getAll().then((blogs) => setBlogs(blogs));
    } catch (e) {
      console.log('Creating a blog didnt work');
    }
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
        <div>
          <Header text={'Blogs'} />
          <p>
            {user.name} logged in{' '}
            <button onClick={() => onLogoutClick()}>logout</button>
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
          <BlogDisplay
            user={user}
            blogs={blogs}
            onLogoutClick={handleLogoutClick}
          />
        </div>
      )}
    </div>
  );
};

export default App;
