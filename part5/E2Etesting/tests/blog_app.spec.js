const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

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
      await loginWith(page, 'mluukkai', 'bobs');

      const errorDiv = await page.locator('.error');
      await expect(errorDiv).toContainText('Wrong username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).not.toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Matti Luukkainen', 'www.test.com');

      await expect(
        page.getByText('Test Blog Matti Luukkainen View')
      ).toBeVisible();
    });

    test('clicking the like button increases likes by 1', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Matti Luukkainen', 'www.test.com');

      await page.getByRole('button', { name: 'View' }).click();
      await page.getByRole('button', { name: 'Like' }).click();
      await expect(page.getByText('likes 1 Like')).toBeVisible();
    });
  });
});
