import Blog from './Blog';

const BlogDisplay = ({ user, blogs }) => (
  <div>
    <h2>Blogs</h2>
    <p>{user.name} logged in</p>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

export default BlogDisplay;
