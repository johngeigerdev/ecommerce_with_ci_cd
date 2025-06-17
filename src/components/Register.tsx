import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Form, Button } from 'react-bootstrap';

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

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
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Form onSubmit={handleRegister} className="register-form">
        <input
            type = "email"
            placeholder = "Email"
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            required  // if pw's don't match, it will not submit the form
        />
        <input
            type = "password"
            placeholder = "Password"
            value={password}
            onChange = {(e) => setPassword(e.target.value)}
            required
        />
        <input 
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
        />
        <Button type="submit" className="btn btn-primary">Register</Button>
        {error && <p>{error}</p>}
    </Form>
  );
};

export default Register;