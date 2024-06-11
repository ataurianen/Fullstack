import { useState, useEffect, useRef } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import storage from './services/storage';
import LoginForm from './components/loginForm';
import Blog from './components/Blog';
import Notification from './components/Notification';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch } from 'react-redux';
import NewBlogForm from './components/NewBlogForm';
import Header from './components/Header';
import Togglable from './components/Togglable';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      setUser(user);
    }
  }, []);

  const blogFormRef = useRef();

  const notify = (message, type = 'success') => {
    dispatch(setNotification({ message, type, time: 5 }));
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      setUser(user);
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
    } catch (e) {
      notify('Wrong username or password', 'error');
    }
  };

  const handleLogoutClick = () => {
    setUser(null);
    storage.removeUser();
  };

  const addBlog = async (blog) => {
    const newBlog = await blogService.create(blog);
    setBlogs(blogs.concat(newBlog));
    notify(`Blog created: ${newBlog.title} ${newBlog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const updateLikes = async (blogToUpdate) => {
    const updatedBlog = await blogService.update(blogToUpdate.id, {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    });
    notify(`You liked ${updatedBlog.title} by ${updatedBlog.author}`);
    setBlogs(
      blogs.map((blog) => (blog.id === blogToUpdate.id ? updatedBlog : blog))
    );
  };

  const handleRemoveClick = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.deleteBlog(blog.id);
      setBlogs(blogs.filter((currentBlog) => currentBlog.id !== blog.id));
    }
  };

  if (!user) {
    return (
      <div>
        <Header text={'Log in to application'} />
        <Notification />
        <LoginForm login={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <Header text={'Blogs'} />
      <Notification />
      <div>
        {user.name} logged in
        <button onClick={handleLogoutClick}>logout</button>
      </div>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <NewBlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            removeBlog={handleRemoveClick}
            updateLikes={updateLikes}
          />
        ))}
    </div>
  );
};

export default App;
