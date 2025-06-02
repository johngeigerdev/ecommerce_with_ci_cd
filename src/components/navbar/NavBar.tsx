import React from 'react';
import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSelectedCategory } from '../../../src/context/CategorySlice.ts';
import { fetchCategories } from '../../api/api';

const NavBar: React.FC = () => {
  const dispatch = useDispatch();

  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">FakeStore</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/cart">
            Cart <Badge bg="light" text="dark">{cartCount}</Badge>
          </Nav.Link>
        </Nav>
        <Form.Select
          onChange={handleCategoryChange}
          value={selectedCategory}
          style={{ maxWidth: '200px' }}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {isLoading && <option>Loading...</option>}
          {error && <option>Error loading</option>}
          {categories?.map((cat) => (
            <option key={cat} value={cat}>
              {cat
              .split(' ')
              .map((word) => word[0].toUpperCase() + word.slice(1))
              .join(' ')}
            </option>
          ))}
        </Form.Select>
      </Container>
    </Navbar>
  );
};

export default NavBar;
