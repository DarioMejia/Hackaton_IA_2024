import { User } from "@/models/user-model";
import firebase from "@/services/firebase-service";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

const auth = getAuth(firebase);
const db = getFirestore(firebase);

export async function signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(
        email: string,
        password: string,
        username?: string
    ) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userInfo: User = {
        uid: user.uid,
        email: user.email ?? email,
        username
    };
    
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, userInfo);

    console.log("User added with ID: ", userRef.id);

    return user;
}


export async function signOutUser() {
    return signOut(auth);
}