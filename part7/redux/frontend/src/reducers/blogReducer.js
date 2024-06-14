import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },

    addBlog(state, action) {
      state.push(action.payload);
    },
    updateLikes(state, action) {
      const id = action.payload;
      const blogToUpdate = state.find((blog) => blog.id === id);
      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };

      return state.map((blog) => (blog.id === id ? updatedBlog : blog));
    },

    removeBlog(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },

    setBlogComment(state, action) {
      const id = action.payload.id;
      const blogToUpdate = state.find((blog) => blog.id === id);
      const updatedBlog = {
        ...blogToUpdate,
        comments: [...blogToUpdate.comments, action.payload.comment],
      };

      return state.map((blog) => (blog.id === id ? updatedBlog : blog));
    },
  },
});

export const { setBlogs, addBlog, updateLikes, removeBlog, setBlogComment } =
  blogSlice.actions;

export default blogSlice.reducer;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blogObject, user) => {
  return async (dispatch) => {
    const newBlog = await blogService.createNew(blogObject);
    const blogWithUser = { ...newBlog, user: user };
    dispatch(addBlog(blogWithUser));
  };
};

export const likeBlog = (blogObject) => {
  return async (dispatch) => {
    const likedBlog = { ...blogObject, likes: blogObject.likes + 1 };
    const updatedBlog = await blogService.update(blogObject.id, likedBlog);
    dispatch(updateLikes(updatedBlog.id));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(removeBlog(id));
  };
};

export const postComment = (id, comment) => {
  return async (dispatch) => {
    await blogService.addComment(id, comment);
    dispatch(setBlogComment({ id, comment }));
  };
};
