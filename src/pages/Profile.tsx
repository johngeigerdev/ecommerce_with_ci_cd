import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { Form, Button, Alert } from 'react-bootstrap';
import { onAuthStateChanged, type User, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Profile = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    //listen for the user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchUserData(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    //fetch user data from Firestore
    const fetchUserData = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || "");
                setStreetAddress(data.streetAddress || "");
                setCity(data.city || "");
                setState(data.state || "");
                setZipCode(data.zipCode || "");
            }
        } catch (err: any) {
            console.error('Firestore fetch error:', err);
            setError("Failed to load user data.");
        }
    };

    //handle profile update
    const handleUpdate = async () => {
        if (!currentUser) return;
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                name,
                streetAddress,
                city,
                state,
                zipCode
            });
            setSuccessMsg("Profile updated successfully!");
        } catch (err: any) {
            setError("Failed to update profile.");
        }
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (!user || !user.email) {
            setError("You must be logged in to delete your account.");
            return;
        }

        const confirmed = window.confirm ("Are you really sure you wanna delete your account? This cannot be undone bruh!");
        if (!confirmed) return;

        //ask for password again to requathenticate the user
        const password = prompt("Please enter your password to confirm account deletion:");
        if (!password) {
            setError("Password is required to delete account.");
            return;
        }

        try {
            //reauthenticate the user with their email and password
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);

            // 1. Delete the user doc from Firestore
            await deleteDoc(doc(db, 'users', user.uid));
            // 2. Delete the user from Firebase Auth
            console.log("attempgint to delete user:", user.uid);
            await deleteUser(user);
            console.log("user deleted successfully from Firebase Auth:", user.uid);
            // 3. Singout the user
            await auth.signOut();
            // 4. Alert and redirect to home
            alert("Account deleted successfully.");
            navigate('/');

        } catch (err: any) {
            console.error("Deletion error:", err);

            if (err.code === 'auth/wrong-password') {
                setError ("Wrong password. Please try again.");
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please try again later.');
            } else { 
                setError('Failed to delete account. Please try again.');
            }
        }
    };
    
        return (
            <div className="p-4">
            <h2>Profile</h2>
            {currentUser ? (
                <p>Welcome {name} - {currentUser.email}</p>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control value={city} onChange={(e) => setCity(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control value={state} onChange={(e) => setState(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                </Form.Group>
                <Button variant="primary mt-3 me-2" onClick={handleUpdate}>Update Profile</Button>
                <Button variant="danger" className="mt-3" onClick={handleDeleteAccount}>Delete My Account</Button>
            </Form>

            {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        </div>
    );
};


export default Profile;
// This component allows users to view and update their profile information.
// It fetches user data from Firestore when the component mounts and updates the profile when the user clicks the "Update Profile" button.
