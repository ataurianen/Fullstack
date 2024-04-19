const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog, resetDatabase, clickLike } = require('./helper');

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

      await expect(page.getByText('Wrong username or password')).toBeVisible();
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
    describe('and multiple blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Test 1', 'Bob Steve', 'www.example1.com');
        await createBlog(page, 'Test 2', 'Bob Steve', 'www.example2.com');
        await createBlog(page, 'Test 3', 'Bob Steve', 'www.example3.com');
      });

      test('blogs are ordered by likes', async ({ page }) => {
        await page
          .getByText('Test 1')
          .getByRole('button', { name: 'View' })
          .click();
        await page
          .getByText('Test 2')
          .getByRole('button', { name: 'View' })
          .click();
        await page
          .getByText('Test 3')
          .getByRole('button', { name: 'View' })
          .click();

        await page.pause();

        const likeButton1 = page
          .getByText('Test 1')
          .getByRole('button', { name: 'Like' });
        await clickLike(page, likeButton1, 1);
        await page
          .getByText('Test 1')
          .getByRole('button', { name: 'Hide' })
          .click();

        const likeButton2 = page
          .getByText('Test 2')
          .getByRole('button', { name: 'Like' });
        await clickLike(page, likeButton2, 3);
        await page
          .getByText('Test 2')
          .getByRole('button', { name: 'Hide' })
          .click();

        const likeButton3 = page
          .getByText('Test 3')
          .getByRole('button', { name: 'Like' });
        await clickLike(page, likeButton3, 2);
        await page
          .getByText('Test 3')
          .getByRole('button', { name: 'Hide' })
          .click();

        await page.pause();
        const blogDivs = await page.locator('div.blog').all();

        expect(blogDivs[0]).toHaveText('Test 2 Bob Steve View');
        expect(blogDivs[1]).toHaveText('Test 3 Bob Steve View');
        expect(blogDivs[2]).toHaveText('Test 1 Bob Steve View');
      });
    });
  });
});
