import storage from '../services/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteBlog, likeBlog } from '../reducers/blogReducer';

const Blog = ({ blogs, notify }) => {
  const id = useParams().id;
  const blog = blogs.find((b) => b.id === id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const updateLikes = async () => {
    dispatch(likeBlog(blog));
    notify(`You liked ${blog.title} by ${blog.author}`);
  };

  const handleRemoveClick = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(id));
      navigate('/');
    }
  };
  if (!blog) {
    return null;
  }

  const showRemoveButton = {
    display: blog.user.username === storage.me() ? '' : 'none',
  };

  return (
    <div>
      <h1>
        {blog.title} {blog.author}
      </h1>

      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes} <button onClick={() => updateLikes()}>Like</button>
      </div>
      <div>{blog.user.name}</div>
      <button style={showRemoveButton} onClick={() => handleRemoveClick()}>
        Remove
      </button>
      <div>{`added by ${blog.user.name}`}</div>
    </div>
  );
};

export default Blog;
