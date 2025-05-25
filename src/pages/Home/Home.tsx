import React from 'react';
import type { Product } from '../../types/types';
import { useEffect, useState } from 'react'; // fetching is a 'side-effect' so best to use use useEffect for this
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import { useProductContext } from '../../context/ProductContext'; //this is the context that will be used in the whole app, by importing it here, we get access to the context and data
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../api/api'; //this is the api that will be used to fetch the products

const Home:React.FC = () => {
  // const [products, setProducts] = useState<Product[]>([]); //since we are using typescript we need to define the type of the state, which is the <Product[]> type, an empty array of products
  const { products, selectedCategory, dispatch } = useProductContext(); //we have access to products, selectedCategory and dispatch b/c we imported the useProductContext

  /*
  useEffect(() => {
      const fetchProducts = async() => {
          const response = await fetch('https://fakestoreapi.com/products');
          //console.log(response); //this is a test to see what is inside the response
          const data = await response.json(); //this will convert the response to json data
          // setProducts(data); //this sets the products array state to the data we received
          dispatch({ type: 'SET_PRODUCTS', payload: data})
          //console.log(data); //testing to see the actual data, is an array of 20 products
        };
      fetchProducts();
  }, [dispatch]); //the empty array means this will only run once when the component mounts
*/ 

//can do this with react-query instead of useEffect, it's much less code and easier to read
  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
  //console.log(data);

  useEffect(() => {
    if (productsData) {
      dispatch ({ type: 'SET_PRODUCTS', payload: productsData.data});
    }
  }, [productsData, dispatch]); //this will run when the productsData changes, and it will set the products state to the data we received

  return (
    <div className="container">
      {products.map((product: Product) => (
        <ProductCard product={product} />
        //we are passing the product as a prop to the ProductCard component
      ))}
    </div>
  )
}

export default Home
