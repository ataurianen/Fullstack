const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');
const api = supertest(app);

const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});
describe('When there is initially some blogs saved', () => {
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

  test('A specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');
    const titles = response.body.map((r) => r.title);
    assert(titles.includes('Canonical string reduction'));
  });

  test('verify unique identifier is id and not _id', async () => {
    const response = await api.get('/api/blogs');
    const body = response.body;
    assert.strictEqual(Object.hasOwn(body[0], 'id'), true);
  });
});

describe('Viewing a specific blog', () => {
  test('Succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.deepStrictEqual(resultBlog.body, blogToView);
  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();
    await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
  });

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api.get(`/api/blogs/${invalidId}`).expect(400);
  });
});

describe('When adding a new blog', () => {
  test('succeeds with vaild data', async () => {
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
    assert(titles.includes('test blog'));
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

  test('fails with status code 400 if data invalid', async () => {
    const newBlogMissingTitle = {
      author: 'tester1',
      url: 'www.testblog.com',
      likes: 69,
    };

    const newBlogMissingUrl = {
      title: 'test blog',
      author: 'tester1',
      likes: 69,
    };

    await api.post('/api/blogs').send(newBlogMissingTitle).expect(400);
    await api.post('/api/blogs').send(newBlogMissingUrl).expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with a status code 204 if id is vaild', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.titles);

    assert(!titles.includes(blogToDelete.title));
  });
});

describe('Updating a blog', () => {
  test('number of likes incrases by 1', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[1];
    const updatedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
    };
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlog);
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body[1].likes, blogsAtStart[1].likes + 1);
  });
});

describe('When there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is not greater than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'yu',
      name: 'Jen',
      password: 'salaissnen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is not greater than 3 chars', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'yuuu',
      name: 'Jen',
      password: 'sa',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username or password is missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserOne = {
      name: 'Jen',
      password: 'salaissnen',
    };

    const newUserTwo = {
      username: 'Bobby',
      name: 'Jen',
    };

    await api
      .post('/api/users')
      .send(newUserOne)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEndOne = await helper.usersInDb();

    assert.strictEqual(usersAtEndOne.length, usersAtStart.length);

    await api
      .post('/api/users')
      .send(newUserTwo)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEndTwo = await helper.usersInDb();

    assert.strictEqual(usersAtEndTwo.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
