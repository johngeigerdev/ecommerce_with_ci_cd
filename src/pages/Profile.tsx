import React from 'react'
import { useProductContext } from '../context/ProductContext'

const Profile:React.FC = () => {
  const {products, selectedCategory, dispatch} = useProductContext();
  return (
    <div>
      
    </div>
  )
}

export default Profile
