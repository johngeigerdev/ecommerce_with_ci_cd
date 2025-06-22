import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';
import type { Product } from '../types/types';

export const fetchProductsFromFirestore = async (category?: string): Promise<Product[]> => {
  const productsRef = collection(db, 'products');

  const q = category
    ? query(productsRef, where('category', '==', category))
    : query(productsRef); // get all products if no category

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const fetchCategories = async (): Promise<string[]> => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => doc.data().name);
};