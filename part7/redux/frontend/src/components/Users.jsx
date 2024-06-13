import { Link } from 'react-router-dom';

const Users = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <td></td>
            <td>blogs created</td>
          </tr>
          {users.map((user) => (
            <tr>
              <td>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
