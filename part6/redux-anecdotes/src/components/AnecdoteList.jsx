/* eslint-disable react/prop-types */
import { vote } from '../reducers/anecdoteReducer';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../reducers/notificationReducer';

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

  const handleVote = (anecdote) => {
    dispatch(vote(anecdote.id));
    dispatch(setNotification(`You voted for: ${anecdote.content}`));
  };

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <Anecdote
              key={anecdote.id}
              anecdote={anecdote}
              handleClick={() => handleVote(anecdote)}
            />
          </div>
        ))}
    </div>
  );
};

export default Anecdotes;
