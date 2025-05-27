import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile';
import { ProductProvider } from './context/ProductContext';
import { QueryClientProvider, QueryClient, Query } from '@tanstack/react-query';
import NavBar from './components/navbar/NavBar';

function App() {

  const client = new QueryClient()

  return (
    //with everything wrapped inside the query client provider, we can access the state and dispatch function in all components
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
