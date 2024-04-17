const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, resetDatabase } = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await resetDatabase(request);
    await page.goto('');
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

    describe('and a blog exisits', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test Blog', 'Matti Luukkainen', 'www.test.com');
      });
      test('clicking the like button increases likes by 1', async ({
        page,
      }) => {
        await page.getByRole('button', { name: 'View' }).click();
        await page.getByRole('button', { name: 'Like' }).click();
        await expect(page.getByText('likes 1 Like')).toBeVisible();
      });

      test('blog can be deleted by creator', async ({ page }) => {
        await page.getByRole('button', { name: 'View' }).click();
        page.on('dialog', async (dialog) => {
          await dialog.accept();
        });
        await page.getByRole('button', { name: 'Remove' });

        await expect(
          page.getByText('Test blog Matti Luukkainen View')
        ).not.toBeVisible();
      });

      test('other users cannot see the Remove button', async ({ page }) => {
        await page.getByRole('button', { name: 'logout' }).click();
        await loginWith(page, 'bob', 'password');

        await page.getByRole('button', { name: 'View' }).click();
        await expect(
          page.getByRole('button', { name: 'Remove' })
        ).not.toBeVisible();
      });
    });
  });
});
