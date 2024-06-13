import { useSelector } from 'react-redux';
import User from './User';

const Users = () => {
  const users = useSelector((state) => {
    const currentUsers = state.users;
    return currentUsers;
  });

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
