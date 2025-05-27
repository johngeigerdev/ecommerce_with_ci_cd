import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchProductsByCategory } from '../../api/api'; //this is the api that will be used to fetch the products
import { useSelector } from 'react-redux'; //this is used to access the state in the redux store, we will use this to get the products and selected category from the store
import type { RootState } from '../../store/store'; //this is the root state of the redux store, we will use this to get the products and selected category from the store
import type { Product } from './../../types/types'; //this is the type for the product, using this to type the products that we get from the api
import { Container, Row, Col } from 'react-bootstrap';

//can do this with react-query instead of useEffect, it's much less code and easier to read

const Home:React.FC = () => {
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory); //this will get the selected category from the redux store, we will use this to filter the products

  //using React Query to fetch products by category or all products if no category is selected
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: selectedCategory
      ? ['products', selectedCategory]
      : ['products', 'all'],
    queryFn: async () => {
      if (selectedCategory) {
        const result = await fetchProductsByCategory(selectedCategory);
        console.log("✅ category products returned:", result);
        return result;
      } else {
        const result = await fetchProducts();
        console.log("✅ all products returned:", result);
        return result;
      }
    },
});


  //console.log('selectedCategory from Redux:', selectedCategory);
  if (isLoading) return <p>Loading products...</p>
  if (error) {
    console.error('Error fetching products:', error);
    return <p>Error fetching products</p>
  }

// Debugging logs to check the selected category and query key
console.log("🟡 Redux selectedCategory:", selectedCategory);
console.log("🧪 Query key:", selectedCategory ? ['products', selectedCategory] : ['products', 'all']);
console.log("📦 Products:", products);

return (
    <Container className="home-container">
      <Row  xs={1} sm={2} md={3} lg={4} className="g-4">
        {products?.map((product: Product) => (
          <Col key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home
