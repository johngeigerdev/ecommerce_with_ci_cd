import React from 'react';
import type { Product, Category } from '../../types/types';
import { useEffect } from 'react'; // fetching is a 'side-effect' so best to use use useEffect for this
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import { useProductContext } from '../../context/ProductContext'; //this is the context that will be used in the whole app, by importing it here, we get access to the context and data
import { useQuery } from '@tanstack/react-query';
import { fetchProducts, fetchCategories } from '../../api/api'; //this is the api that will be used to fetch the products

const Home:React.FC = () => {
  // const [products, setProducts] = useState<Product[]>([]); //since we are using typescript we need to define the type of the state, which is the <Product[]> type, an empty array of products
  const { products, selectedCategory, dispatch } = useProductContext(); //we have access to products, selectedCategory and dispatch b/c we imported the useProductContext


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

  const { data: categories } = useQuery({
    queryKey: ['categoreis'],
    queryFn: fetchCategories,
  });
  console.log(categories);

  //create a function to filter the products based on the selected category
  const getFilteredProducts = () => {
    if (selectedCategory) {
      return products.filter((product: Product) => product.category === selectedCategory);
    } else {
      return products;
    } 
  }

  const productsToDisplay = getFilteredProducts(); //this will return the products that match the selected category, or all products if no category is selected
  // console.log(productsToDisplay);
  return (
    <div className="home-container">
      <div>
        {/* for the categories selector here to work, we will need to set the selectedCategory state in the context to reflect the selected category */}
        <select
          onChange={(e) => 
            dispatch({type: "SET_SELECTED_CATEGORY", payload: e.target.value}) 
          }
          value = {selectedCategory} // this will set the selected category to the selected category the global state so if you clear it with the button below, the selection will show it set back to 'all categories'
        >
          <option value=''>All Categories</option>
          {categories?.data.map((category: Category) => (
            <option value={category} key={category}>{category}</option>  //always have a key when mapping over data
          ))}
        </select>
        <button
          onClick = {() => {
            dispatch({type: "SET_SELECTED_CATEGORY", payload: ''});
          }}
        >
          Clear Filter
          </button>
      </div>
      <div className="container">
        {productsToDisplay.map((product: Product) => (
          <ProductCard product={product} key={product.id} />  
          //we are passing the product as a prop to the ProductCard component
        ))}
      </div>
    </div>
  )
}

export default Home
