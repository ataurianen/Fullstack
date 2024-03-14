import Blog from './Blog';

const BlogDisplay = ({ user, blogs, onLogoutClick }) => (
  <div>
    <h2>Blogs</h2>
    <p>
      {user.name} logged in{' '}
      <button onClick={() => onLogoutClick()}>logout</button>
    </p>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

export default BlogDisplay;
