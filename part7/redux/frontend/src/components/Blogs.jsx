import Togglable from './Togglable';
import Blog from './Blog';
import NewBlogForm from './NewBlogForm';
import { useRef } from 'react';
import { createBlog, deleteBlog, likeBlog } from '../reducers/blogReducer';
import { useDispatch } from 'react-redux';

const Blogs = ({ blogs, notify, loggedInUser }) => {
  const dispatch = useDispatch();

  const blogFormRef = useRef();

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

  return (
    <div>
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

export default Blogs;
