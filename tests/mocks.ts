import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { FranchiseList, Menu, Order, OrderResponse, Role, User } from '../src/service/pizzaService';

export async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'diner', roles: [{ role: Role.Diner }] } };
  const menu: Menu = [{ id: 't1ihu9owlq', title: 'test pizza', description: 'A test pizza', image: '/test-pizza.jpg', price: 10 }];
  const franchises: FranchiseList = {
    franchises: [{ id: 'franchise-1', name: 'Test franchise', stores: [{ id: '1', name: 'Test store' }] }],
    more: false,
  };
  const order: Order = {
    id: 'order-1',
    franchiseId: 'franchise-1',
    storeId: '1',
    date: '2026-10-07T00:00:00.000Z',
    items: [{ menuId: 't1ihu9owlq', description: 'test pizza', price: 10 }],
  };

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });

  await page.route('*/**/api/order/menu', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menu });
  });

  await page.route('*/**/api/franchise*', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchises });
  });

  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  await page.route('*/**/api/order', async (route) => {
    expect(route.request().method()).toBe('POST');
    const requestOrder = route.request().postDataJSON() as Order;
    const response: OrderResponse = { order: { ...order, items: requestOrder.items }, jwt: 'test-jwt' };
    await route.fulfill({ json: response });
  });
}