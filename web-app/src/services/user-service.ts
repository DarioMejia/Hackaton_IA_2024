
import { User } from "@/models/user-model";
import firebase from "@/services/firebase-service";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore(firebase);


export const getUserById = async (uid: string) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data() as User;
    }
    return null;
};

export const changeUsername = async (uid: string, username: string) => {};

export const getUserByUsername = async (username: string) => {};

export const isUsernameAvailable = async (username: string) => {};

