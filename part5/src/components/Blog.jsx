import { useState } from 'react';

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' };
  const showWhenVisible = { display: detailsVisible ? '' : 'none' };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title}
        <button onClick={() => setDetailsVisible(false)}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {blog.likes} <button>like</button>
        <br />
        {blog.author}
      </div>

      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>view</button>
      </div>
    </div>
  );
};

export default Blog;
