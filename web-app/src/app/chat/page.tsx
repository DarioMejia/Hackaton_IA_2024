'use client';
import ChatMessage from "@/components/chat/ChatMsg";
import Loader from "@/components/common/Loader";
import { Message, ChatRols} from "@/lib/types";
import { User } from "@/models/user-model";
import { useAuthContext } from "@/providers/authProvider";
import { getUserById } from "@/services/user-service";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { useEffect } from "react";
import { FormEvent, useState } from "react";


export default function Page() {
    const { user, signOut }: any = useAuthContext();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!user;

    
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchUser = async () => {
            const userInfo = await getUserById(user.uid);
            setUserInfo(userInfo);
        };

        fetchUser();
    }, [isAuthenticated, user.uid]);

    if (!isAuthenticated) {
        router.push('/auth/signin');
        return null;
    }
    
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
           {
                role: ChatRols.user,
                text: userMessage,
                date: new Date(),
           },
        ]);

        setLoading(true);
        const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage }),
        });
        setLoading(false);
        setUserMessage('');
        
        const data = await res.json();
        setChatHistory((prevChatHistory) => [
            ...prevChatHistory,
            {
                role: ChatRols.model, 
                text: data.message,
                date: new Date(),
            }
        ]);
    };

    
    return <main className="flex min-h-screen max-h-screen overflow-hidden bg-zinc-900 items-center flex-col">
        <div className="flex-1 h-full w-full max-h-screen overflow-hidden flex flex-col justify-center items-center">
            <div className="flex-grow h-full overflow-y-auto flex flex-col p-3 w-full items-center">
                {chatHistory.length === 0 && (
                    <div className="grow flex flex-col gap-3 justify-center items-center text-zinc-500 my-3">
                        <p className="text-4xl font-bold">Chatbot - ProcessOptima</p>
                        {userInfo?.username && (<p>Welcome <span className="font-bold">{userInfo.username}</span></p>)}
                    </div>
                )}

                {chatHistory.length > 0 && (
                    <div className="grow w-full md:max-w-3xl">
                        {chatHistory.map((message, index) => (
                            <ChatMessage key={index} message={message} />
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
                        className={`flex-1 bg-zinc-800 text-white outline-none ${loading ? "opacity-50" : ""}`}
                        value={userMessage}
                        disabled={loading}
                        onChange={(e) => setUserMessage(e.target.value)}
                    />

                    {loading && (<Loader/>)}

                    {!loading && <button 
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
