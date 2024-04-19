import { useState } from 'react';
import storage from '../services/storage';

const Blog = ({ blog, removeBlog, updateLikes }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const showRemoveButton = {
    display: blog.user.username === storage.me() ? '' : 'none',
  };

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}{' '}
      <button onClick={() => setDetailsVisible(!detailsVisible)}>
        {detailsVisible ? 'Hide' : 'View'}
      </button>
      {detailsVisible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => updateLikes(blog)}>Like</button>
          </div>
          <div>{blog.user.name}</div>
          <button style={showRemoveButton} onClick={() => removeBlog(blog)}>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
