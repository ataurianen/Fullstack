import {
  TableBody,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Users = ({ users }) => {
  return (
    <TableContainer>
      <h2>Users</h2>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell />
            <TableCell>blogs created</TableCell>
          </TableRow>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link to={`/users/${user.id}`}>{user.name}</Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Users;
