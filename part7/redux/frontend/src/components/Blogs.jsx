import Togglable from './Togglable';
import NewBlogForm from './NewBlogForm';
import { useRef } from 'react';
import { createBlog } from '../reducers/blogReducer';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

const Blogs = ({ blogs, notify, loggedInUser }) => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

  const addBlog = async (blog) => {
    dispatch(createBlog(blog, loggedInUser));
    notify(`Blog created: ${blog.title} ${blog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div>
      <Togglable buttonLabel='New Blog' ref={blogFormRef}>
        <NewBlogForm createBlog={addBlog} />
      </Togglable>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blogs
              .toSorted((a, b) => b.likes - a.likes)
              .map((blog) => (
                <TableRow style={blogStyle} key={blog.id}>
                  <TableCell>
                    <Link to={`/${blog.id}`}>{blog.title}</Link>
                  </TableCell>
                  <TableCell>{blog.author}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;
