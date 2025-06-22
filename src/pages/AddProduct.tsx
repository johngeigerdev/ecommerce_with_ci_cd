//this component allows for the admin to add new products to the store

import { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import {collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const fetchedCategories = querySnapshot.docs.map(doc => doc.data().name);
                setCategories(fetchedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchCategories();
}, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'products'), {
                title,
                price: parseFloat(price),
                description,
                category,
                image,
                createdAt: serverTimestamp()
            });
            setSuccess('Product added successfully!');
            setError('');
            setTimeout(() => navigate('/'), 2000); // Redirect to home after success
        } catch (err: any) {
            console.error(err);
            setError('Failed to add product. Please try again.');
            setSuccess('');
        }
    };

    return (
        <div className="p-4">
            <h2>Add Product</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control value={image} onChange={(e) => setImage(e.target.value)} required />
                </Form.Group>
                <Button type="submit">Add Product</Button>
            </Form>

            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
    );
};

export default AddProduct;