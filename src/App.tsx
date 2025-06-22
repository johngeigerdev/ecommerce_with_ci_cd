import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { QueryClientProvider, QueryClient, Query } from '@tanstack/react-query';
import NavBar from './components/navbar/NavBar';
import CheckoutPage from './pages/CheckoutPage';
import CartPage from './pages/Cart/CartPage';
import { auth } from "./firebase/firebaseConfig";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./pages/Profile";
import { useState, useEffect } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
//import ImportProducts from './api/importProducts';
import AddProduct from './pages/AddProduct';
import useAdminCheck from './custom_hooks/useAdminCheck';


function App() {
  const [user, setUser] = useState<User | null>(null);

  const client = new QueryClient()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  })

  const AdminRoute = ({children}: {children: JSX.Element }) => {
    const isAdmin = useAdminCheck();

    if (isAdmin === null) return <p>Loading...</p>
    if (!isAdmin) return <p>Access denied. You are not an admin.</p>

    return children;
  }

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
            <Route path="/add-product" element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route path="/add-product" element={<AddProduct />} />
            {/* This route is for importing products from the fakestoreapi, it was a one time use, when going to the page, the script in the 
            component imports the products to Firestore*/}
            {/* <Route path="/import" element={<ImportProducts />} /> */}
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
