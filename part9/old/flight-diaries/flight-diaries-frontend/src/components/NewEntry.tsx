const NewEntry = () => {
  return (
    <form>
      <p>
        date: <input type='date' />
      </p>
      <p>
        visiability: <input type='text' />
      </p>
      <p>
        weather: <input type='text' />
      </p>
      <p>
        comment: <input type='text' />
      </p>
      <button>add</button>
    </form>
  );
};

export default NewEntry;
