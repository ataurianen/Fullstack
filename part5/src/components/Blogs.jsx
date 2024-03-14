import Blog from './Blog';

const BlogDisplay = ({ user, blogs, onLogoutClick }) => (
  <div>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

export default BlogDisplay;
