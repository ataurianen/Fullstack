import Blog from './Blog';

const BlogDisplay = ({ blogs }) => (
  <div>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} />
    ))}
  </div>
);

export default BlogDisplay;
