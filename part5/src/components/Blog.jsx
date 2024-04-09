import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, user, removeBlog }) => {
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
  const showRemoveButton = {
    display: blog.user.username === user.username ? '' : 'none',
  };

  const handleLikeClick = async () => {
    console.log(blog.user.username);
    console.log(user.username);
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      likes: likes + 1,
    };
    const response = await blogService.updateLikes(blog.id, updatedBlog);
    setLikes(response.likes);
  };

  const handleRemoveClick = () => {
    removeBlog(blog);
  };

  return (
    <div style={blogStyle}>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(false)}>Hide</button>
        <br />
        {blog.url}
        <br />
        likes {likes} <button onClick={handleLikeClick}>Like</button>
        <br />
        {blog.user.name}
        <br />
        <button style={showRemoveButton} onClick={handleRemoveClick}>
          Remove
        </button>
      </div>

      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setDetailsVisible(true)}>View</button>
      </div>
    </div>
  );
};

export default Blog;
