
import firebase from "@/services/firebase-service";
import { getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore(firebase);

export const getUserById = async (uid: string) => {};

export const changeUsername = async (uid: string, username: string) => {};

export const getUserByUsername = async (username: string) => {};

export const isUsernameAvailable = async (username: string) => {};

