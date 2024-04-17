const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'New Blog' }).click();
  await page.getByTestId('Title').fill(title);
  await page.getByTestId('Author').fill(author);
  await page.getByTestId('URL').fill(url);
  await page.getByRole('button', { name: 'Create' }).click();
};

const resetDatabase = async (request) => {
  await request.post('/api/testing/reset');
  await request.post('/api/users', {
    data: {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen',
    },
  });
  await request.post('/api/users', {
    data: {
      name: 'Ted Tester',
      username: 'ted',
      password: 'tedsecret',
    },
  });
};

export { loginWith, createBlog, resetDatabase };
