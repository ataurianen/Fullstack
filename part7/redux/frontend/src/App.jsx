import { useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import { setNotification } from './reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import { initializeBlogs } from './reducers/blogReducer';
import Header from './components/Header';
import Blogs from './components/Blogs';
import { loadUser, logout, userLogIn } from './reducers/userReducer';
import { Link, Route, Routes } from 'react-router-dom';
import Users from './components/Users';
import { initializeUsers } from './reducers/usersReducer';
import UserProfile from './components/UserProfile';
import Blog from './components/Blog';
import { AppBar, Button, Container, IconButton, Toolbar } from '@mui/material';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadUser());
    dispatch(initializeUsers());
  }, []);

  const blogs = useSelector((state) => {
    const currentBlogs = state.blogs;
    return currentBlogs;
  });

  const users = useSelector((state) => {
    const currentUsers = state.users;
    return currentUsers;
  });

  const loggedInUser = useSelector(({ user }) => user);

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

  if (!loggedInUser) {
    return (
      <div>
        <Header text={'Log in to application'} />
        <Notification />
        <LoginForm login={handleLogin} />
      </div>
    );
  }

  const navBarStyle = {
    padding: 2,
    background: 'lightgray',
  };

  return (
    <Container>
      <AppBar position='static'>
        <Toolbar>
          <IconButton edge='start' color='inherit' aria-label='menu' />
          <Button color='inherit' component={Link} to='/'>
            Blogs
          </Button>
          <Button color='inherit' component={Link} to='/users'>
            Users
          </Button>
          <em>{loggedInUser.name} logged in</em>
          <Button color='inherit' onClick={handleLogoutClick}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Header text={'Blogs'} />
      <Notification />
      <Routes>
        <Route
          path='/'
          element={
            <Blogs blogs={blogs} notify={notify} loggedInUser={loggedInUser} />
          }
        />
        <Route path='/:id' element={<Blog blogs={blogs} notify={notify} />} />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/users/:id' element={<UserProfile users={users} />} />
      </Routes>
    </Container>
  );
};

export default App;
