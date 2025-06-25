import React from 'react'
import { useState } from 'react';
import type { Product } from '../../types/types'
import { Rating } from '@smastrom/react-rating';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../context/CartSlice';
import { Card, Button } from 'react-bootstrap';

interface Props {
  product: Product; //defining the type of the product prop that we will receive in this component
}

//below the {product: Product} is saying we will have the prop of 'product' and of type 'Product' which we defined in types.ts
//this is a functional component, we are using the 'React.FC' type to define that this is a functional component
const ProductCard:React.FC<Props> = ({ product }) => {
  const [rating, setRating] = useState(0)
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    const productToCart = {
      ...product,
      createdAt: product.createdAt?.toDate().toISOString() ?? null  // the .toISOString is to convert the date to a string format before pushing to Redux
    };
    dispatch(addToCart(productToCart));
  }

  console.log("rating data:", product.rating);
  return (
    <Card className="h-100 shadow-sm d-flex flex-column justify-content-between product-card">
        <Card.Img 
          variant="top"
          src={product.imageUrl ?? product.image} //using the imageUrl if it exists, otherwise using the image property}
          style={{ height: '200px', objectFit: 'contain'}}
          alt={product.title} 
          className="my-4 mx-auto"
        />
        <Card.Body className="d-flex flex-column justify-content-between">
          <Card.Title className="text-center">{product.title}</Card.Title>
          <Rating 
            className="my-3" 
            style={{ maxWidth: 200 }} 
            value= {typeof product.rating ===  'number' ? product.rating : product.rating?.rate ?? 0}
            readOnly 
          />
          <Card.Text>{product.description}</Card.Text>
          <div className="mt-auto text-center">
            <div className="fw-bold text-success fs-5 mb-2">
              ${product.price.toFixed(2)}  {/* this formats the price to 2 decimal places */}
            </div>
            <Button onClick = {handleAddToCart} className='btn btn-primary px-4'>Add To Cart</Button>
          </div>
        </Card.Body>
    </Card>
    
  )
}

export default ProductCard
