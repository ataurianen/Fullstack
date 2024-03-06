const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('verify unique identifier is id and not _id', async () => {
    const response = await api.get('/api/blogs');
    const body = response.body;
    assert.strictEqual(Object.hasOwn(body[0], 'id'), true);
  });
});

describe('When adding a new blog', () => {
  test('a vaild blog can be added', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'tester1',
      url: 'www.testblog.com',
      likes: 69,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((n) => n.title);
    assert.strictEqual(titles.at(-1), newBlog.title);
  });

  test('if likes property is missing from request, defaults to 0', async () => {
    const newBlog = {
      title: 'test blog',
      author: 'tester1',
      url: 'www.testblog.com',
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const likes = blogsAtEnd.map((r) => r.likes);
    assert.strictEqual(likes.length, helper.initialBlogs.length + 1);
    assert.strictEqual(likes.at(-1), 0);
  });
});

after(async () => {
  await mongoose.connection.close();
});
