"use client";

import React from 'react';
import {
    onAuthStateChanged,
    getAuth,
    User as FirebaseUser,
} from 'firebase/auth';
import firebase from '@/services/firebase-service';
import { signOutUser } from '@/services/auth-service';

const auth = getAuth(firebase);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = React.useState<FirebaseUser | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOutUser();
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};