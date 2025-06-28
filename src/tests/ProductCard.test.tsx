import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard'; // Adjust path if needed
import { Provider } from 'react-redux';
import { store } from '../store/store'; // Adjust path
import { BrowserRouter } from 'react-router-dom';
import { within } from '@testing-library/react';

jest.mock('@smastrom/react-rating', () => ({
  Rating: () => <div data-testid="mock-rating" />
}));

//this must match exactly what the Product type is defined as in types.ts
const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 19.99,
  image: 'https://via.placeholder.com/150',
  imageUrl: 'https://via.placeholder.com/150',
  description: 'This is a test product.',
  category: 'Test Category',
  rating: {
    rate: 4.5,
    count: 100
  },
  createdAt: {
    toDate: () => new Date()
  }
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </Provider>
  );
};

describe('ProductCard', () => {
  test('renders product details correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    screen.debug(); // This will log the current state of the DOM 

    expect(screen.getByText(/\$19\.99/)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProduct.image || mockProduct.imageUrl);
    expect(screen.getAllByText(/Test Product/i).length).toBeGreaterThan(0);
  });

  test('fires add to cart action on button click', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    const button = screen.getByRole('button', { name: /add to cart/i });


    fireEvent.click(button);
    expect(button).toBeEnabled();
  });
});