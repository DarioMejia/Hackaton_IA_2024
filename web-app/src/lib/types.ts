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

export interface ChatInfo {
    userId: string;
    chatName?: string;
    createdAt: Date;
    isDeleted?: boolean; 
    updatedAt?: Date;
}

export interface Chat extends ChatInfo {
    id: string; 
}


export interface UserInfo {
    email: string;
    username?: string;
    isDeleted?: boolean;
}
export interface User extends UserInfo {
    uid: string;
}
