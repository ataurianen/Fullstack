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
  await page.getByText(`${title} ${author} View`).waitFor();
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
      name: 'Bob Steve',
      username: 'bob',
      password: 'password',
    },
  });
};

const clickLike = async (page, button, number) => {
  for (let i = 0; i < number; i++) {
    await button.click();
    await page.getByText(`likes ${i + 1}`).waitFor();
  }
};

export { loginWith, createBlog, resetDatabase, clickLike };
