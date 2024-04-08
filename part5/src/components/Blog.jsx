import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const hideWhenVisible = { display: detailsVisible ? 'none' : '' };
  const showWhenVisible = { display: detailsVisible ? '' : 'none' };

  const handleClick = async () => {
    const response = await blogService.updateLikes(blog);
    setLikes(response.likes);
  };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(false)}>hide</button>
        <br />
        {blog.url}
        <br />
        likes {likes} <button onClick={handleClick}>like</button>
        <br />
        {blog.user.name}
      </div>

      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>view</button>
      </div>
    </div>
  );
};

export default Blog;
