import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Button, Form, Container } from 'react-bootstrap';

interface ProductFormData {
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    rating: {
        rate: number;
        count: number;
    };
}

const EditProductPage: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProductFormData>({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    rating: { rate: 0, count: 0 },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', productId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      } else {
        alert('Product not found');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'products', productId!);
      await updateDoc(docRef, formData);
      alert('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      console.error('Update failed', err);
      alert('Failed to update product');
    }
  };

  return (
    <Container className="py-4">
      <h2>Edit Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control name="title" value={formData.title} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
            <Form.Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="women's clothing">Women's Clothing</option>
            </Form.Select>
        </Form.Group>
        <Button type="submit">Update Product</Button>
      </Form>
    </Container>
  );
};

export default EditProductPage;