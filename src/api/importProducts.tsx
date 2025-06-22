import { useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// This component imports products from a fake store API into Firestore
// It fetches product data from 'https://fakestoreapi.com/products' and adds each product to the 'products' collection in Firestore.


const ImportProducts = () => {
  useEffect(() => {
    const importData = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const products = await res.json();

        const productsCollection = collection(db, 'products');

        for (const product of products) {
          await addDoc(productsCollection, {
            name: product.title,
            description: product.description,
            price: product.price,
            imageUrl: product.image,
            category: product.category,
            rating: product.rating?.rate || 0,
            createdAt: serverTimestamp(),
          });
        }

        console.log("✅ Products imported!");
      } catch (err) {
        console.error("❌ Failed to import products:", err);
      }
    };

    importData();
  }, []);

  return <p>Importing products...</p>;
};

export default ImportProducts;