import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDby_kLlnyWcYqbw8Eh4BESrcCpdU1WOJk",
  authDomain: "ecommerce-project-573c4.firebaseapp.com",
  projectId: "ecommerce-project-573c4",
  storageBucket: "ecommerce-project-573c4.firebasestorage.app",
  messagingSenderId: "123785957832",
  appId: "1:123785957832:web:ed6adfcb3fd9aba63ff0fd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

export { auth }; 