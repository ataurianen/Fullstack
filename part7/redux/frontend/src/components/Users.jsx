import { useSelector } from 'react-redux';
import User from './User';

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <div></div>
      <div>blogs created</div>
      <div>
        {users.map((user) => (
          <User user={user} />
        ))}
      </div>
    </div>
  );
};

export default Users;
