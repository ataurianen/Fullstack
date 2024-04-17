import { useState } from 'react';

const Blog = ({ blog, user, removeBlog, updateLikes }) => {
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

  const handleLikeClick = () => {
    console.log(blog);
    const blogToUpdate = {
      ...blog,
      likes: likes + 1,
      user: blog.user.id,
    };
    updateLikes(blogToUpdate);
    setLikes(likes + 1);
  };

  const handleRemoveClick = () => {
    removeBlog(blog);
  };

  return (
    <div style={blogStyle}>
      <div className='detailsVisible' style={showWhenVisible}>
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

      <div className='detailsHidden' style={hideWhenVisible}>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setDetailsVisible(true)}>View</button>
      </div>
    </div>
  );
};

export default Blog;
