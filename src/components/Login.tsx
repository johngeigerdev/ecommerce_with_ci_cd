import { useState, type FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
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
            <Form onSubmit={handleLogin} className="login-form">
                <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" className="btn btn-primary">Login</Button>
                {error && <p className="error-message">{error}</p>}
            </Form>
            <Button onClick={handleLogout} className="btn btn-secondary">Logout</Button>
        </>
    );
};

export default Login;