import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { removeFromCart } from '../../context/CartSlice';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './CartPage.css';

const CartPage: React.FC = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);

    const handleRemove = (id: number) => {
        dispatch(removeFromCart(id));
    }

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    return (
        <Container fluid className="pt-4 min-vh-100 d-flex flex-column align-items-center cart-container">
            <Row className="mb-4">
                <Col className="text-center">
                    <h2>🛒 Your Cart</h2>
                </Col>
            </Row>

            {cartItems.length === 0 ? (
                <Row>
                    <Col>
                        <p>Your Cart is empty.</p>
                    </Col>
                </Row>
            ) : (
                <>
                    { cartItems.map((item) => (
                        <Row key={item.id} className="w-100 justify-content-center">
                            <Col xs={12} md={8} lg={6}>
                                <Card className="mb-3 shadow-sm" key={item.id} style={{ minHeight: '20rem' }}>
                                    <Card.Body className="d-flex align-items-center">
                                        <Row className="mb-3 w-100">
                                            <Col className="d-flex align-items-center justify-content-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    style={{width: '10rem', height: '10rem', objectFit: 'contain'}}
                                                />
                                            </Col>
                                            <Col className="d-flex flex-column justify-content-center">
                                                <h5>{item.title}</h5>
                                                <p>Price: ${item.price.toFixed(2)}</p>
                                                <p>Quantity: {item.quantity}</p>
                                            </Col>
                                            <Col className="d-flex align-items-center justify-content-end">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleRemove(item.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ))            
                    }
                    <Row>
                        <Col className="text-end">
                            <h4>Total: ${total.toFixed(2)}</h4>
                        </Col>
                    </Row>
                </>
            )
        }
        </Container>
    );
}

export default CartPage;