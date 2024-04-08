import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const updateLikes = async (blog) => {
  const currentBlog = await axios.get(`${baseUrl}/${blog.id}`);

  const updatedBlog = {
    user: currentBlog.data.user.id,
    title: currentBlog.data.title,
    author: currentBlog.data.author,
    url: currentBlog.data.url,
    likes: currentBlog.data.likes + 1,
  };

  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog);
  return response.data;
};

export default { getAll, setToken, create, updateLikes };
