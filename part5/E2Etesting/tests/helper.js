const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill('mluukkai');
  await page.getByTestId('password').fill('salainen');
  await page.getByRole('button', { name: 'Login' }).click();
};

export { loginWith };
