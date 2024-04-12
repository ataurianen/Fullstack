import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/loginForm';
import Blog from './components/Blog';
import NewBlogForm from './components/NewBlogForm';
import Header from './components/Header';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const Notification = ({ message, className }) => {
    if (message === null) {
      return null;
    }

    return <div className={className}>{message}</div>;
  };

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogFormRef = useRef();

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
    } catch (e) {
      setErrorMessage('Wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogoutClick = (e) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility();
    const newBlog = await blogService.create(blogObject);
    setBlogs(blogs.concat(newBlog).sort((a, b) => b.likes - a.likes));
  };

  const updateLikes = async (blogToUpdate) => {
    await blogService.update(blogToUpdate);
  };

  const handleRemoveClick = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      blogService.deleteBlog(blog.id);
      setBlogs(blogs.filter((currentBlog) => currentBlog.id !== blog.id));
    }
  };

  return (
    <div>
      {user === null ? (
        <>
          <Header text={'Log in to application'} />
          <Notification className='error' message={errorMessage} />
          <LoginForm login={handleLogin} />
        </>
      ) : (
        <div>
          <Header text={'Blogs'} />
          <p>
            {user.name} logged in
            <button onClick={handleLogoutClick}>logout</button>
          </p>
          <Togglable buttonLabel='New Blog' ref={blogFormRef}>
            <NewBlogForm createBlog={addBlog} />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                user={user}
                blog={blog}
                removeBlog={handleRemoveClick}
                updateLikes={updateLikes}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
