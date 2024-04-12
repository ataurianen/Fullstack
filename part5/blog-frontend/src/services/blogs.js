import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;
let config;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
  config = {
    headers: { Authorization: token },
  };
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (updatedBlog) => {
  console.log('updated blog in service', updatedBlog);
  const response = await axios.put(`${baseUrl}/${updatedBlog.id}`, updatedBlog);
  return response.data;
};

const deleteBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, setToken, create, update, deleteBlog };
