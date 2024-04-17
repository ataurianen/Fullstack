const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset');
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });

    await page.goto('http://localhost:5173');
  });

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Username')).toBeVisible();
    await expect(page.getByText('Password')).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai');
      await page.getByTestId('password').fill('bobs');
      await page.getByRole('button', { name: 'Login' }).click();

      await expect(page.getByText('Wrong username or password')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'New Blog' }).click();
      await page.getByTestId('Title').fill('Test Blog');
      await page.getByTestId('Author').fill('Matti Luukkainen');
      await page.getByTestId('URL').fill('www.test.com');
      await page.getByRole('button', { name: 'Create' }).click();

      await expect(
        page.getByText('Test Blog Matti Luukkainen View')
      ).toBeVisible();
    });
  });
});
