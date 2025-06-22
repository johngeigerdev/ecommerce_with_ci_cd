import React from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import { useQuery } from '@tanstack/react-query';
import { fetchProductsFromFirestore } from '../../firebase/firebaseHelpers';
import { useSelector } from 'react-redux'; //this is used to access the state in the redux store, we will use this to get the products and selected category from the store
import type { RootState } from '../../store/store'; //this is the root state of the redux store, we will use this to get the products and selected category from the store
import type { Product } from './../../types/types'; //this is the type for the product, using this to type the products that we get from the api
import { Container, Row, Col } from 'react-bootstrap';

//can do this with react-query instead of useEffect, it's much less code and easier to read

const Home: React.FC = () => {
  const selectedCategory = useSelector((state: RootState) => state.category.selectedCategory);

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: selectedCategory ? ['products', selectedCategory] : ['products', 'all'],
    queryFn: () => fetchProductsFromFirestore(selectedCategory),
  });

  if (isLoading) return <p>Loading products...</p>;
  if (error) {
    console.error('Error fetching products:', error);
    return <p>Error fetching products</p>;
  }

  console.log("🟡 Selected Category:", selectedCategory);
  console.log("📦 Products from Firestore:", products);

  return (
    <Container fluid className="home-container py-5">
      <Row  sm={1} md={2} lg={4} xl={4}className="g-5 px-3 justify-content-center">
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
