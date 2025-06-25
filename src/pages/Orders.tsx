import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';
import { Container, Spinner, Accordion } from 'react-bootstrap';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(fetched);
      setLoading(false);
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);
  if (loading) return <div className="text-center mt-5"><Spinner /></div>;

  return (
    <Container className="py-4">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <Accordion defaultActiveKey="0">
          {orders.map((order, index) => (
            <Accordion.Item eventKey={index.toString()} key={order.id}>
              <Accordion.Header>
                Order #{order.id} - {order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString() : 'Pending...'} - ${order.total?.toFixed ? order.total.toFixed(2) : '0.00'}
              </Accordion.Header>
              <Accordion.Body>
                <p><strong>Shipping to:</strong> {order.shipping?.name}, {order.shipping?.address}</p>
                <ul>
                  {order.items?.map((item: any) => (
                    <li key={item.id || item.title}>
                        <img src={item.image} alt={item.title} style={{ width: '40px', marginRight: '10px' }} />    
                        <strong>{item.title}</strong> - ${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default OrdersPage;