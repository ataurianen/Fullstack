/* eslint-disable react/prop-types */
import { vote } from '../reducers/anecdoteReducer';
import { useDispatch, useSelector } from 'react-redux';

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const Anecdotes = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return anecdotes.filter((anecdote) =>
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <Anecdote
              key={anecdote.id}
              anecdote={anecdote}
              handleClick={() => dispatch(vote(anecdote.id))}
            />
          </div>
        ))}
    </div>
  );
};

export default Anecdotes;
