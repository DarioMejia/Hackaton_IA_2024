import firebase from "@/services/firebase-service";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth(firebase);

export async function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
}
