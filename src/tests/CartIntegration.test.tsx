import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ProductCard from '../components/ProductCard';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { BrowserRouter } from 'react-router-dom';

//mock the rating because without this, it keeps throwing an aggregate error at render
jest.mock('@smastrom/react-rating', () => ({
    Rating: () => <div data-testid='mock-rating' />
}));

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 19.99,
  image: 'https://via.placeholder.com/150',
  imageUrl: 'https://via.placeholder.com/150',
  description: 'This is a test product.',
  category: 'Test Category',
  rating: { rate: 4.5, count: 100 },
  createdAt: { toDate: () => new Date() }
};

describe('Cart Integration Test', () => {
  test('adds product to cart when clicking Add To Cart button', async () => {
    await act(async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <ProductCard product={mockProduct} />
          </BrowserRouter>
        </Provider>
      );
    });

    const button = screen.getByRole('button', { name: /add to cart/i });

    await act(async () => {
      fireEvent.click(button);
    });

    const cartState = store.getState().cart;
    expect(cartState.items.length).toBeGreaterThan(0);
    expect(cartState.items[0].id).toBe(mockProduct.id);
  });
});
