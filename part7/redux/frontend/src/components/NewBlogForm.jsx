import { useState } from 'react';
import Header from './Header';
import { Button, TextField } from '@mui/material';

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
        <TextField
          variant='outlined'
          label='Title'
          size='small'
          margin='dense'
          value={blogTitle}
          data-testid='Title'
          onChange={(e) => setBlogTitle(e.target.value)}
        />
        <br />
        <TextField
          variant='outlined'
          label='Author'
          size='small'
          margin='dense'
          value={blogAuthor}
          data-testid='Author'
          onChange={(e) => setBlogAuthor(e.target.value)}
        />
        <br />
        <TextField
          variant='outlined'
          label='URL'
          size='small'
          margin='dense'
          value={blogURL}
          data-testid='Author'
          onChange={(e) => setBlogURL(e.target.value)}
        />

        <br />
        <Button type='submit' variant='contained' color='primary'>
          Create
        </Button>
      </form>
    </>
  );
};

export default NewBlogForm;
