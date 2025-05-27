import React from 'react'
import type { Product } from '../../types/types'
import { Rating } from '@smastrom/react-rating';
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { addToCart } from '../../context/CartSlice';
import { Card, Button } from 'react-bootstrap';
import './ProductCard.css';


interface Props {
  product: Product; //defining the type of the product prop that we will receive in this component
}

//below the {product: Product} is saying we will have the prop of 'product' and of type 'Product' which we defined in types.ts
//this is a functional component, we are using the 'React.FC' type to define that this is a functional component
const ProductCard:React.FC<Props> = ({ product }) => {
  const [rating, setRating] = useState(0)
  const dispatch = useDispatch();
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  }

  return (
    <Card className="mb-4 product-card">
        <Card.Img className="product-image mt-4" src={product.image} alt={product.title} style={{ height: '200px', objectFit: 'contain'}}/>
        <Card.Body>
          <Card.Title>{product.title}</Card.Title>
          <Card.Text>{product.category}</Card.Text>
          <Card.Text>${product.price}</Card.Text>
          <Rating style={{ maxWidth: 200 }} value={product.rating.rate} readOnly />
          <Card.Text>{product.description}</Card.Text>
          <Button className='btn btn-primary'>Add To Cart</Button>
        </Card.Body>
    </Card>
    
  )
}

export default ProductCard
