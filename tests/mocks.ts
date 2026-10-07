import { Page } from '@playwright/test';
import { test, expect } from 'playwright-test-coverage';
import { FranchiseList, Menu, Order, OrderResponse, Role, Store, User } from '../src/service/pizzaService';

export async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'diner', roles: [{ role: Role.Diner }] },
    'a@jwt.com': { id: '1', name: 'Admin', email: 'a@jwt.com', password: 'admin', roles: [{ role: Role.Admin }] },
    'f@jwt.com': { id: '2', name: 'Franchisee', email: 'f@jwt.com', password: 'franchisee', roles: [{ role: Role.Franchisee, objectId: 'franchise-1' }] },
  };
  const menu: Menu = [{ id: 't1ihu9owlq', title: 'test pizza', description: 'A test pizza', image: '/test-pizza.jpg', price: 10 }];
  const franchises: FranchiseList = {
    franchises: [{ id: 'franchise-1', name: 'test franchise 1nywynlzzh', admins: [{ email: 'a@jwt.com', name: 'Admin' }], stores: [{ id: '1', name: 'Test store' }] }],
    more: false,
  };
  const order: Order = {
    id: 'order-1',
    franchiseId: 'franchise-1',
    storeId: '1',
    date: '2026-10-07T00:00:00.000Z',
    items: [{ menuId: 't1ihu9owlq', description: 'test pizza', price: 10 }],
  };
  const store: Store = {
    id: 'store-1',
    name: 'awesome_store',
  };
  const franchiseeFranchise = { id: 'franchise-1', name: 'Test franchise', stores: [] as Store[] };

  // Authorize login for the given user
  await page.route('**/api/auth', async (route) => {
    const request = route.request();
    if (request.method() === 'DELETE') {
      await route.fulfill({ json: {} });
      return;
    }

    const authReq = request.postDataJSON();
    if (request.method() === 'PUT') {
      const user = validUsers[authReq.email];
      if (!user || user.password !== authReq.password) {
        await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
        return;
      }
      loggedInUser = user;
    } else {
      loggedInUser = { id: '4', name: authReq.name, email: authReq.email, password: authReq.password, roles: [{ role: Role.Diner }] };
    }
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(['POST', 'PUT']).toContain(request.method());
    await route.fulfill({ json: loginRes });
  });

  await page.route('**/api/order/menu', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menu });
  });

  await page.route('**/api/franchise*', async (route) => {
    const request = route.request();
    if (request.method() === 'DELETE') {
      await route.fulfill({ json: {} });
      return;
    }
    if (request.method() === 'POST') {
      await route.fulfill({ json: { ...request.postDataJSON(), id: 'franchise-2', stores: [] } });
      return;
    }
    expect(request.method()).toBe('GET');
    if (new URL(request.url()).pathname === '/api/franchise/2') {
      await route.fulfill({ json: [franchiseeFranchise] });
      return;
    }
    if (request.url().endsWith('/api/franchise/3')) {
      await route.fulfill({ json: franchises.franchises });
      return;
    }
    await route.fulfill({ json: franchises });
  });

  await page.route('**/api/franchise/2', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: [franchiseeFranchise] });
  });

  await page.route('**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  await page.route('**/api/order', async (route) => {
    if (route.request().method() === 'GET') {
        await route.fulfill({ json: { orders: [] } });
    } else {
        expect(route.request().method()).toBe('POST');
        const requestOrder = route.request().postDataJSON() as Order;
        const response: OrderResponse = { order: { ...order, items: requestOrder.items }, jwt: 'test-jwt' };
        await route.fulfill({ json: response });
    }
  });

  await page.route('**/api/franchise/*/store*', async (route) => {
    const request = route.request();
    if (request.method() === 'POST') {
      const requestStore = request.postDataJSON() as Store;
      const createdStore = { ...store, ...requestStore };
      franchiseeFranchise.stores.push(createdStore);
      await route.fulfill({ json: createdStore });
    } else {
      expect(request.method()).toBe('DELETE');
      franchiseeFranchise.stores = [];
      await route.fulfill({ json: null });
    }
  });
}