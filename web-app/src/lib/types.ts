import firebase from "firebase/compat/app";


export enum ChatRols {
    user = 'user',
    model = 'model',
}

export interface Message {
    role: ChatRols;
    text: string;
    date: Date;
}

export interface Chat {
    id: string; 
    userId: string;
    createdAt: firebase.firestore.Timestamp;
    isDeleted?: boolean;
}
export interface User {
    uid: string;
    email: string;
    username?: string;
    isDeleted?: boolean;
}
