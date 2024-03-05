const _ = require('lodash');

const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 'List is empty';
  } else {
    return blogs.reduce((sum, currentValue) => sum + currentValue.likes, 0);
  }
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return 'List is empty';
  } else {
    let mostLikedBlog = blogs[0];
    blogs.forEach((blog) => {
      if (blog.likes > mostLikedBlog.likes) {
        mostLikedBlog = blog;
      }
    });
    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes,
    };
  }
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return 'List is empty';
  } else {
    const result = _.max(Object.entries(_.countBy(blogs, 'author')));
    return {
      author: result[0],
      blogs: result[1],
    };
  }
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
