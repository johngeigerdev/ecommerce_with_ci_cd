import React from 'react';
import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { setSelectedCategory } from '../../../src/context/CategorySlice.ts';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig.ts';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../firebase/firebaseHelpers.ts';
import useAdminCheck from '../../custom_hooks/useAdminCheck.ts';


const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout successful!");
      navigate("/"); // Redirect to home page after successful logout
    } catch (err: any) {
      console.error("Logout error:", err.message);
      alert("Logout failed. Please try again.");
    }
  }

  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isAdmin = useAdminCheck();

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
          {currentUser ? (
            <>
              <Nav.Link
                onClick={handleLogout}
              >
                Logout
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
            </>
          )}
          {isAdmin && (
            <Nav.Link as={Link} to="/admin/products">Manage Products</Nav.Link>
          )}
          {/* hide the 'Register' link if user is logged  */}
          <Nav.Link as={Link} to="/cart">
            Cart <Badge bg="light" text="dark">{cartCount}</Badge>
          </Nav.Link>
          {/* show 'Welcome' message if user is logged in */}
          { currentUser && (
            <span className="text-light my-auto ms-3">
              Welcome, <strong>{currentUser.email}</strong>!
            </span>
          )}
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
