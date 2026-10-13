import { test, expect } from 'playwright-test-coverage';

test('updateUser', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
  await page.goto('/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Register' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza diner');

  await page.getByRole('button', { name: 'Edit' }).click();
  await expect(page.locator('h3')).toContainText('Edit user');
  await page.getByRole('textbox').first().fill('pizza dinerx');
  await page.getByRole('button', { name: 'Update' }).click();

  await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

  await expect(page.getByRole('main')).toContainText('pizza dinerx');

  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();

  await page.getByRole('textbox', { name: 'Email address' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pd' }).click();

  await expect(page.getByRole('main')).toContainText('pizza dinerx');
});

test('update email and password', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('diner');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pd' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill('diner@jwt.com');
  await page.locator('#password').click();
  await page.locator('#password').fill('diner1');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('navigation', { name: 'Global' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('diner@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('diner1');
  await page.getByRole('button', { name: 'Login' }).click();await page.getByRole('link', { name: 'pd' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('input[type="email"]').click();
  await page.locator('input[type="email"]').fill('d@jwt.com');
  await page.locator('#password').click();
  await page.locator('#password').fill('diner');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});

test('changing user info using different roles', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('#password').click();
  await page.locator('#password').fill('admin1');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin1');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: '常' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.locator('#password').click();
  await page.locator('#password').fill('admin');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'pf' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('pizza franchisee :)');
  await page.getByRole('button', { name: 'Update' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('textbox').first().click();
  await page.getByRole('textbox').first().fill('pizza franchisee');
  await page.getByRole('button', { name: 'Update' }).click();
});