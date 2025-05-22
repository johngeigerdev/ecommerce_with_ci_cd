import React from 'react'
import type { Product } from '../../types/types'
import './ProductCard.css' //importing the css file for this component
import { Rating } from '@smastrom/react-rating';
import { useState } from 'react' 
//below the {product: Product} is saying we will have the prop of 'product' and of type 'Product' which we defined in types.ts
//this is a functional component, we are using the 'React.FC' type to define that this is a functional component
const ProductCard:React.FC<{product: Product}> = ({product}) => {
const [rating, setRating] = useState(0)

  return (
    <div className="product-card">
        <h3>{product.title}</h3>
        <h5>{product.category}</h5>
        <p>${product.price}</p>
        <img className="product-image" src={product.image} alt={product.title} />
        <Rating style={{ maxWidth: 200 }} value={product.rating.rate} readOnly />
        <p>{product.description}</p>
    </div>
  )
}

export default ProductCard
