import { test, expect } from './testSetup';
import { basicInit } from './mocks';

test('listUsers', async ({ page }) => {
	await basicInit(page);

	await page.goto('/');
	await page.getByRole('link', { name: 'Login' }).click();
	await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
	await page.getByRole('textbox', { name: 'Password' }).fill('admin');
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByRole('link', { name: 'Admin' }).click();

	await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
	await expect(page.getByRole('main')).toContainText('d@jwt.com');
	await expect(page.getByRole('main')).toContainText('a@jwt.com');
	await expect(page.getByRole('main')).toContainText('f@jwt.com');
	await expect(page.getByRole('main')).toContainText('diner');
	await expect(page.getByRole('main')).toContainText('admin');
    await expect(page.getByRole('main')).not.toContainText('Test user 8');
	await expect(page.getByRole('main').getByRole('table').nth(1).getByRole('row')).toHaveCount(12);

	await page.getByRole('button', { name: 'Next' }).click();
	await expect(page.getByRole('main')).toContainText('Test user 8');
    await expect(page.getByRole('main')).not.toContainText('d@jwt.com');
	await expect(page.getByRole('main').getByRole('table').nth(1).getByRole('row')).toHaveCount(4);

	await page.getByRole('textbox', { name: 'Filter users by name' }).fill('Kai');
	await page.getByRole('button', { name: 'Filter' }).click();
	const usersTable = page.getByRole('table').nth(1);
	await expect(usersTable).toContainText('Kai Chen');
	await expect(usersTable).not.toContainText('Admin');
	await expect(usersTable).not.toContainText('Franchisee');

	await page.getByRole('button', { name: 'Delete Kai Chen' }).click();
	await expect(usersTable).not.toContainText('Kai Chen');
});