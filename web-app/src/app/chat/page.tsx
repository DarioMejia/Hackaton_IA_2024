'use client';
import ChatMessage from "@/components/chat/ChatMsg";
import Loader from "@/components/common/Loader";
import { Message, ChatRols} from "@/lib/types";
import { User } from "@/lib/types";
import { useAuthContext } from "@/providers/authProvider";
import { addMessage, createChat, findChatsByUserId, getMessages } from "@/services/chat-service";
import { getUserById } from "@/services/user-service";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect, useRef } from "react";
import { FormEvent, useState } from "react";


export default function Page() {
    const { user, signOut }: any = useAuthContext();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);    
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    const [userMessage, setUserMessage] = useState('');
    const [loadingResponse, setLoadingResponse] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    const isAuthenticated = !!user;
 
    useEffect(() => {
        if (!isAuthenticated) return;

        setLoadingData(true);
        const fetchUser = async () => {
            const userInfo = await getUserById(user.uid);
            setUserInfo(userInfo);
        };

        const fetchChat = async () => {
            const chats = await findChatsByUserId(user.uid);
            
            if (!chats || chats.length === 0) {
                setChatId(await createChat(user.uid));
            } else {
                setChatId(chats[0].id);
            }
        };

        const fetchMessages = async () => {
            if (!chatId) return;

            const messages = await getMessages(chatId);
            console.log(messages)
            setChatHistory(messages);

        };

        fetchUser();
        fetchChat();
        fetchMessages();
        setLoadingData(false);
    }, [isAuthenticated, user?.uid, chatId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    if (!isAuthenticated) {
        router.push('/auth/signin');
        return null;
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!chatId || !userMessage) return;

        let messange: Message = {
            role: ChatRols.user,
            text: userMessage,
            date: new Date(),
        };
        await addMessage(chatId, user.uid,messange);

        setChatHistory((prevChatHistory) => [...prevChatHistory, messange]);

        setLoadingResponse(true);
        const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage }),
        });
        setLoadingResponse(false);
        setUserMessage('');
        
        const data = await res.json();
        messange = {
            role: ChatRols.model,
            text: data.message,
            date: new Date(),
        };
        await addMessage(chatId, user.uid,messange);
        setChatHistory((prevChatHistory) => [...prevChatHistory, messange]);
    };

    
    return <main className="flex min-h-screen max-h-screen overflow-hidden bg-zinc-900 items-center flex-col">
        <div className="flex-1 h-full w-full max-h-screen overflow-hidden flex flex-col justify-center items-center">
            <div ref={chatContainerRef} className="flex-grow h-full overflow-y-auto flex flex-col p-3 w-full items-center">
                {loadingData && (
                    <div className="grow flex flex-col gap-3 justify-center items-center text-zinc-500 my-3">
                        <Loader />
                        <p>Loading data...</p>
                    </div>)}
                
                {!loadingData && chatHistory.length === 0 && (
                    <div className="grow flex flex-col gap-3 justify-center items-center text-zinc-500 my-3">
                        <p className="text-4xl font-bold">Chatbot - ProcessOptima</p>
                        {userInfo?.username && (<p>Welcome <span className="font-bold">{userInfo.username}</span></p>)}
                    </div>
                )}

                {!loadingData && chatHistory.length > 0 && (
                    <div className="grow w-full md:max-w-3xl">
                        {chatHistory.map((message, index) => (
                            <ChatMessage key={index} message={message} id={'msg' + index}/>
                        ))}
                    </div>)
                }
            </div>
            
            <div className="w-full md:max-w-4xl">
                <form
                    onSubmit={handleSubmit}
                    className="bg-zinc-800 rounded-full flex flex-row overflow-hidden px-5 p-3 shadow-sm">
                    <input
                        type="text"
                        placeholder="Escriba algo..."
                        className={`flex-1 bg-zinc-800 text-white outline-none ${loadingResponse ? "opacity-50" : ""}`}
                        value={userMessage}
                        disabled={loadingResponse}
                        onChange={(e) => setUserMessage(e.target.value)}
                    />

                    {loadingResponse && (<Loader/>)}

                    {!loadingResponse && <button 
                        type="submit"
                        className="bg-zinc-800  rounded-xl"
                    >
                        <Image
                            src="/icons/send.svg"
                            width={24}
                            height={24}
                            alt={""} 
                            className="dark:invert-[.8]"
                        />
                    </button>}
                </form>
                <div className="text-center text-sm text-zinc-500 my-3">
                    Chatbot - ProcessOptima | <a className="hover:text-zinc-100 cursor-pointer" onClick={signOut}>Sing out</a>
                </div>
            </div>
        </div>
    </main>
}
