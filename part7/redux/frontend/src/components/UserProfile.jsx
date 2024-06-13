import { useParams } from 'react-router-dom';

const UserProfile = ({ users }) => {
  const id = useParams().id;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <br />
      <h2>added blogs:</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfile;
