import { useState, type FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect } from "react";


const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            navigate("/"); // Redirect to home page after successful login
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert("Logout successful!");
        } catch (err: any) {
            console.error("Logout error:", err.message);
        }
    };

    return (
        <>
            {currentUser ? (
                <>
                    <h2>Welcome back, <strong>{currentUser.email}</strong>!</h2>
                    <Button onClick={handleLogout} className="btn btn-secondary mt-3">Logout</Button>
                </>
            ) : (
            
                <Form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError(null); //clears the error when user types

                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError(null); //clears the error when user types

                        }}  
                        required
                    />
                    <Button type="submit" className="btn btn-primary">Login</Button>
                    {error && (
                        <Alert variant="danger" className="mt-3">
                            {error}
                        </Alert>
                    )}
                </Form>
            )}
        </>
    );
};

export default Login;