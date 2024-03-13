const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');

const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');

const testUser = {
  username: 'testuser',
  name: 'Test User',
  password: 'password',
};

let token;

describe('When there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));

    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);

    await api.post('/api/users').send(testUser);

    const response = await api.post('/api/login').send(testUser);

    token = response.body.token;
  });

  test('blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

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
      title: 'New Blog',
      author: 'New Author',
      url: 'http://testblog.com',
      likes: 69,
    };

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
      .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(postResponse.body.title, newBlog.title);
    assert.strictEqual(postResponse.body.author, newBlog.author);
    assert.strictEqual(postResponse.body.url, newBlog.url);
    assert.strictEqual(postResponse.body.likes, newBlog.likes);

    await api.get('/api/blogs');

    const blogsAtEnd = await helper.blogsInDb();

    const titles = blogsAtEnd.map((blog) => blog.title);

    assert(titles.includes('New Blog'));
  });

  test('if likes property is missing from request, defaults to 0', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://testblog.com',
    };

    const postResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(postResponse.body.likes, 0);
  });

  test('blog without title is not added', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test('a valid blog is not added without a token', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 5,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });

  test('blog without url is not added', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      likes: 5,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    console.log('blogsAtEnd:', blogsAtEnd);
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with a status code 204 if id is vaild', async () => {
    const blogToDelete = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://testblog.com',
      likes: 69,
    };

    const response = await api
      .post('/api/blogs')
      .send(blogToDelete)
      .set('Authorization', `Bearer ${token}`);

    const id = response.body.id;

    const blogsAtStart = await helper.blogsInDb();

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

    const titles = blogsAtEnd.map((r) => r.titles);

    assert(!titles.includes(blogToDelete.title));
  });
});

describe('Updating a blog', () => {
  test('number of likes incrases by 1', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const newBlog = {
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://example.com/updated',
      likes: 10,
    };

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(201);

    const blogsAtEnd = await helper.blogsInDb();

    const updatedBlog = blogsAtEnd.find((blog) => blog.id === blogToUpdate.id);

    assert.strictEqual(updatedBlog.title, newBlog.title);
    assert.strictEqual(updatedBlog.author, newBlog.author);
    assert.strictEqual(updatedBlog.url, newBlog.url);
    assert.strictEqual(updatedBlog.likes, newBlog.likes);
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
