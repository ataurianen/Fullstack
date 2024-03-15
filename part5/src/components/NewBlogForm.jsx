import { useState } from 'react';
import Header from './Header';

const NewBlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('');
  const [blogURL, setBlogURL] = useState('');

  const addBlog = (e) => {
    e.preventDefault();

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogURL,
    });

    setBlogTitle('');
    setBlogAuthor('');
    setBlogURL('');
  };

  return (
    <>
      <Header text={'Create a new Blog'} />
      <form onSubmit={addBlog}>
        Title:
        <input
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        <br />
        Author:
        <input
          value={blogAuthor}
          onChange={(e) => setBlogAuthor(e.target.value)}
        />
        <br />
        URL:
        <input value={blogURL} onChange={(e) => setBlogURL(e.target.value)} />
        <br />
        <button type='submit'>Create</button>
      </form>
    </>
  );
};

export default NewBlogForm;
