import { useEffect, useRef } from 'react';
import LoginForm from './components/LoginForm';
import Blog from './components/Blog';
import Notification from './components/Notification';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBlog,
  initializeBlogs,
  deleteBlog,
  likeBlog,
} from './reducers/blogReducer';
import NewBlogForm from './components/NewBlogForm';
import Header from './components/Header';
import Togglable from './components/Togglable';
import { loadUser, logout, userLogIn } from './reducers/userReducer';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const blogs = useSelector((state) => {
    const currentBlogs = state.blogs;
    return currentBlogs;
  });

  const loggedInUser = useSelector(({ user }) => user);

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  const blogFormRef = useRef();

  const notify = (message, type = 'success') => {
    dispatch(setNotification({ message, type, time: 5 }));
  };

  const handleLogin = async (username, password) => {
    try {
      dispatch(userLogIn({ username, password }));
      notify(`Welcome back, ${username}`);
    } catch (e) {
      notify('Wrong username or password', 'error');
    }
  };

  const handleLogoutClick = () => {
    dispatch(logout());
  };

  const addBlog = async (blog) => {
    dispatch(createBlog(blog, loggedInUser));
    notify(`Blog created: ${blog.title} ${blog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const updateLikes = async (blogToUpdate) => {
    dispatch(likeBlog(blogToUpdate));
    notify(`You liked ${blogToUpdate.title} by ${blogToUpdate.author}`);
  };

  const handleRemoveClick = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id));
    }
  };

  if (!loggedInUser) {
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
        {loggedInUser.name} logged in
        <button onClick={handleLogoutClick}>logout</button>
      </div>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <NewBlogForm createBlog={addBlog} />
      </Togglable>

      {blogs
        .toSorted((a, b) => b.likes - a.likes)
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
