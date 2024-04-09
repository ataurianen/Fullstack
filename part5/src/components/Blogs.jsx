import Blog from './Blog';

const BlogDisplay = ({ blogs, user, removeBlog }) => (
  <div>
    {blogs.map((blog) => (
      <Blog key={blog.id} user={user} blog={blog} removeBlog={removeBlog} />
    ))}
  </div>
);

export default BlogDisplay;
