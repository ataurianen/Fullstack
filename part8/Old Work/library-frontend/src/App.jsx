import { Routes, Route, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import { ALL_AUTHORS } from './queries';

const App = () => {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <div>
        <Link to='/'>authors</Link>
        {'  '}
        <Link to='/books'>books</Link>
        {'  '}
        <Link to='/add'>add book</Link>
      </div>
      <div>
        <Routes>
          <Route
            path='/'
            element={<Authors authors={result.data.allAuthors} />}
          />
          <Route path='/books' element={<Books />} />
          <Route path='/add' element={<NewBook />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
