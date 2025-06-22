//this is a custom hook to check if signed in user is an admin

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const useAdminCheck = () => {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userRef);
                setIsAdmin(docSnap.exists() && docSnap.data().isAdmin === true);
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    return isAdmin;
};

export default useAdminCheck;