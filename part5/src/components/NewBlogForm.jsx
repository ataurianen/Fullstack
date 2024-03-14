const NewBlogForm = (props) => {
  return (
    <>
      <form onSubmit={props.onSubmit}>
        Title:
        <input
          value={props.valueBlogTitle}
          onChange={props.onChangeBlogTitle}
        />
        <br />
        Author:
        <input
          value={props.valueBlogAuthor}
          onChange={props.onChangeBlogAuthor}
        />
        <br />
        URL:
        <input value={props.valueBlogURL} onChange={props.onChangeBlogURL} />
        <br />
        <button type='submit'>Create</button>
      </form>
    </>
  );
};

export default NewBlogForm;
