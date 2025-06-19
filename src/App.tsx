import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile';
import { QueryClientProvider, QueryClient, Query } from '@tanstack/react-query';
import NavBar from './components/navbar/NavBar';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/Cart/CartPage';
import { auth } from "./firebaseConfig";
import Register from "./components/Register";
import Login from "./components/Login";
import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const client = new QueryClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  })

  return (
    //with everything wrapped inside the query client provider, we can access the state and dispatch function in all components
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
