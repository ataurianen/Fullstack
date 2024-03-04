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
  } else if (blogs.length === 1) {
    return {
      title: blogs[0].title,
      author: blogs[0].author,
      likes: blogs[0].likes,
    };
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
