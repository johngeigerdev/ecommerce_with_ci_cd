import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProductsFromFirestore } from '../firebase/firebaseHelpers';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Alert } from 'react-bootstrap';
import type { Product } from '../types/types';

const AdminProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProductsFromFirestore(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      await deleteDoc(doc(db, 'products', productId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', 'all']);
      alert('Product deleted successfully!');
    },
    onError: () => {
      alert('Error deleting product.');
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <Alert variant="danger">Error loading products.</Alert>;

  return (
    <Container className="py-5">
      <h2 className="mb-4">Admin Product Management</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id}>
              <td>
                <img src={product.imageUrl || product.image} alt={product.title} height="50" />
              </td>
              <td>{product.title}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(product.id.toString())}>Edit</Button>
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(product.id.toString())}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminProductsPage;