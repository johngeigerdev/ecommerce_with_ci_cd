import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../src/store/store.ts';
import { clearCart } from '../context/CartSlice.ts';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { auth } from '../firebase/firebaseConfig';

const CheckoutPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate= useNavigate();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const sanitizedItems = cartItems.map(item => ({
        id: item.id ?? '',
        title: item.title ?? 'Untitled',
        price: item.price ?? 0,
        quantity: item.quantity ?? 1,
        image: item.image ?? item.imageUrl ?? '',
    }));
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        cardNumber: '',
        expirationDate: '',
        cvv: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value}));
    };


    const handleOrderSubmit = async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('You must be logged in to place an order.');
            return;
        }

        const orderData = {
            userId: user.uid,
            items: sanitizedItems,
            total,
            createdAt: serverTimestamp(),
            shipping: {
                name: formData.name ?? '',
                address: formData.address ?? '',
                city: formData.city ?? '',
                zip: formData.zip ?? '',
                country: formData.country ?? '',
        }
    };

        try {
            await addDoc(collection(db, 'orders'), orderData);
            dispatch(clearCart()); // Clear cart after order is placed using Redux action
            alert('Order placed successfully!');
            navigate('/orders'); // Redirect to orders page
        } catch (err) {
            console.error('Error placing order: ', err);
            alert('Failed to place order. Please try again.');
        }
    };

    return (
        <Container className="py-5">
            <Row>
                {/* Shipping info form */}
                <Col md={6}>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        handleOrderSubmit();
                    }}>
                        <h3>Shipping Information</h3>
                        {/* the below line is passing the formData object to the Form component, so that it can be used to loop through and populate the form fields */}
                        {['name', 'email', 'address', 'city', 'zip', 'country'].map(field => (
                            <Form.Group key={field} className="mb-3">
                                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={field}
                                    value={(formData as any) [field]}
                                    onChange={handleChange}
                                    required
                                    placeholder={`Enter your ${field}`}
                                />
                            </Form.Group>
                        ))}
                    
                        <h3 className="mt-4">Payment Information</h3>
                        <Form.Group className="mb-3">
                            <Form.Label>Cardholder Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter cardholder name"
                                value={formData.name}
                                name="name"
                                onChange={handleChange}
                                required
                            />
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                value={formData.cardNumber}
                                name="cardNumber"
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Expiration Date</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="MM/YY"
                                value={formData.expirationDate}
                                name="expirationDate"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter CVV"
                                value={formData.cvv}
                                name="cvv"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <h4 className="text-center">Total: ${total.toFixed(2)}</h4>
                        <Button type="submit" variant="success" className="w-100">Place Order</Button>
                    </Form>
                </Col>

                {/* Cart summary */}
                <Col md={6} className="d-flex flex-column">
                    <h3>Order Summary</h3>
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3">
                            <Card.Body>
                                <Row>
                                    <Col xs={4}>
                                        <img
                                            src={item.image}
                                            style={{ width: '100%', objectFit: 'contain', maxHeight: '100px'}}
                                        />
                                    </Col>
                                    <Col xs={8}>
                                        <h5>{item.title}</h5>
                                        <p>Qty: {item.quantity}</p>
                                        <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                </Col> 
            </Row>
        </Container>
    )
}

export default CheckoutPage;