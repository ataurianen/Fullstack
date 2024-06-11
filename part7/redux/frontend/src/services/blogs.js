import axios from 'axios';
import storage from './storage';

const baseUrl = '/api/blogs';

const getConfig = () => ({
  headers: { Authorization: `Bearer ${storage.loadUser().token}` },
});

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfig());
  return response.data;
};

const update = async (id, updatedBlog) => {
  const response = await axios.put(
    `${baseUrl}/${id}`,
    updatedBlog,
    getConfig()
  );
  return response.data;
};

const deleteBlog = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig());
};

export default { getAll, createNew, update, deleteBlog };
