import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [success, setSuccess] = useState<boolean>(false);


  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    const isValidEmail = (email: string): boolean => {
        const emailRegexCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegexCheck.test(email);
    }
    if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
    }

    if (!isValidEmail(email)) {
        setError("Invalid email format.");
        return;
    }

    try {
        //password length validation
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //Add user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            createdAt: serverTimestamp(),
        })

        setSuccess(true);
        setError(null);
        setTimeout(() => {
            navigate('/login'); // Redirect to login page after successful registration
        }, 2000); // 2 seconds delay before redirecting
    } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
            setError("Email is already in use. Please use a different email.");
        } else {
            setError(err.message);
        }
    }
  };

  return (
    <Form onSubmit={handleRegister} className="register-form">
        <input
            type = "email"
            placeholder = "Email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setError(null); // resets the error when user types
            }}
            required 
        />
        <input
            type = "password"
            placeholder = "Password"
            value={password}
            onChange = {(e) => {
                setPassword(e.target.value)
                setError(null); // resets the error when user types
            }}
            required
            minLength={8} // Ensures password is at least 8 characters long
        />
        <input 
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError(null); // resets the error when user types
            }}
            required
        />
        <Button type="submit" className="btn btn-primary" disabled={success}>Register</Button>
        {error && (
            <Alert variant="danger" className="mt-3">
                {error}
            </Alert>
            )}

        {success && (
            <Alert variant="success" className="mt-3">
                Registration successful! Redirecting to login...
            </Alert>
        )}
    </Form>
  );
};

export default Register;