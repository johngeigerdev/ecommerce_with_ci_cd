import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Profile from './pages/Profile';
import { ProductProvider } from './context/ProductContext';
import { QueryClientProvider, QueryClient, Query } from '@tanstack/react-query';

function App() {

  const client = new QueryClient()

  return (
    //with everything wrapped inside the query client provider, we can access the state and dispatch function in all components
    <QueryClientProvider client={client}>
    {/* with everything inside the provider, we can access the state and dispatch function in all components */}
      <ProductProvider>  
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </ProductProvider>
    </QueryClientProvider>
  )
}

export default App
