import { collection, addDoc, doc, serverTimestamp, getFirestore, query, orderBy, getDocs, where, updateDoc, DocumentReference, DocumentData, getDoc } from "firebase/firestore";
import firebase from "@/services/firebase-service";
import { Chat, ChatInfo, Message } from "@/lib/types";
import { generateUsername } from "unique-username-generator";
import { capitalize } from "@/lib/utils";

const db = getFirestore(firebase);

export async function createChat(userId: string, chatName: string = generateUsername(" ")): Promise<string> {

    chatName = capitalize(chatName.trim());
    
    const chatInfo: ChatInfo = {
        userId,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        chatName
    };

    const chatRef = await addDoc(collection(db, "chats"), chatInfo);
    console.log(chatRef);
    return chatRef.id;
};


export async function findChatById(chatId: string): Promise<Chat | null> {
    const chatDoc = await getDoc(doc(db, "chats", chatId));

    if (chatDoc.exists()) {
        return {
            id: chatDoc.id,
            ...chatDoc.data(),
            createdAt: chatDoc.data().createdAt.toDate()
        } as Chat;
    }

    return null;
};

export async function findChatsByUserId(userId: string): Promise<Chat[]> {
    try {
        const chatsRef = collection(db, "chats");
        const userChatsQuery = query(
            chatsRef,
            where("userId", "==", userId),
            where("isDeleted", "==", false),
            orderBy("updatedAt", "desc"),
        );
        const querySnapshot = await getDocs(userChatsQuery);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return chats.map((chat: any) => {
            return {
                id: chat.id,
                userId: chat.userId,
                chatName: chat.chatName,
                createdAt: chat.createdAt.toDate(),
                updatedAt: chat.updatedAt.toDate()
            };
        });
    } catch (error) {
        console.error("Error getting chats:", error);
        return [];
    }
};

export async function deleteChat(chatId: string) {
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
        isDeleted: true
    });
};

export async function getMessages(chatId: string): Promise<Message[]> {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesQuery = query(messagesRef, orderBy("date", "asc"));
    const querySnapshot = await getDocs(messagesQuery);
    const data = querySnapshot.docs.map(doc => doc.data());
    
    return data.map((message: any) => {return {role: message.role, text: message.text, date: message.date.toDate()}});

};

export async function addMessage(chatId: string, userId: string, message: Message) {
    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, message);

    // Update the chat's updatedAt field
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
        updatedAt: new Date()
    });

};


