'use client';
import ChatMessage from "@/components/chat/ChatMsg";
import CloseIcon from "@/components/common/CloaseIcon";
import Loader from "@/components/common/Loader";
import PlusIcon from "@/components/common/PlusIcon";
import { Message, ChatRols, Chat} from "@/lib/types";
import { User } from "@/lib/types";
import { useAuthContext } from "@/providers/authProvider";
import { addMessage, createChat, findChatById, findChatsByUserId, getMessages } from "@/services/chat-service";
import { getUserById } from "@/services/user-service";
import Image from "next/image";
import { useRouter } from "next/navigation";

import React, { use, useEffect, useRef } from "react";
import { FormEvent, useState } from "react";


export default function Page() {
    const initialized = useRef(false);

    const { user, signOut }: any = useAuthContext();
    const router = useRouter();

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [chatName, setChatName] = useState<string | null>(null);

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

        const fetchChats = async () => {
            const _chats = await findChatsByUserId(user.uid);
            
            if (_chats && _chats.length > 0) {
                setChatId(_chats[0].id);
                setChat(_chats[0]);
                setChatName(_chats[0].chatName ?? '');
            }

            setChats(_chats as Chat[]);
        };

        fetchUser();
        fetchChats();
        setLoadingData(false);

        initialized.current = true;
    }, [isAuthenticated, user?.uid]);

    useEffect(() => {
        if (!isAuthenticated) return;
        if (!chatId) return;

        setLoadingData(true);
        const fetchMessages = async () => {
            if (!chatId) return;

            const messages = await getMessages(chatId);
            setChatHistory(messages);

        };
        setLoadingData(false);
        fetchMessages();
    }, [isAuthenticated, chatId]);

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
        if (!chatId) {
            const chatId = await createChat(user.uid);
            const _chats = await findChatsByUserId(user.uid);
            console.log(_chats);
            setChats(_chats as Chat[]);
            setChatId(chatId);
            setChat(_chats[0]);
            setChatName(_chats[0].chatName ?? '');
        }
        
        if (!chatId) return <h1>Somethig went wrong...</h1>;

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

        setChats(await findChatsByUserId(user.uid) as Chat[]);
    };

    const handleCreateChat = async () => {
        const chatId = await createChat(
            user.uid
        );

        setChatId(chatId);
        const chat = await findChatById(chatId);    
        setChats([...chats, chat as Chat]);
        setChatName(chat!.chatName ?? '');
    };
    
    const handleChangeChat = async (chatId: string) => {
        setChatId(chatId);
        const chat = await findChatById(chatId);
        setChat(chat as Chat);
        setChatName(chat!.chatName ?? '');
    };

    const handleChangeChatName = async (newName: string) => {
        console.log(`Hello ${newName}`);
    };
    
    return <main className="flex min-h-screen max-h-screen overflow-hidden bg-zinc-900 flex-row">
        <aside className="bg-zinc-950 w-52  p-5 text-zinc-300 overflow-hidden">
            <h2 className=" font-bold text-lg my-5 ">Chatbot</h2>

            <button
                className="text-sm text-zinc-300 flex flex-row just items-center gap-3 hover:bg-zinc-900 transition-all rounded-lg w-full py-1 px-3 "
                onClick={handleCreateChat}
                >
                    <PlusIcon/><span>New Chat</span>
            </button>
            <hr className="border-zinc-700 my-5"/>
            
            <div className="overflow-y-auto flex flex-col flex-grow h-full hidden-scroll-bar text-zinc-400 pb-40">{
            chats.map((chat, index) => (
                <button
                    key={index}
                    className="block w-full text-left my-3 rounded-lg cursor-pointer py-1 px-3 hover:bg-zinc-900 transition-all hover:text-zinc-100 text-md"
                    onClick={() => handleChangeChat(chat.id)}
                >
                    <p className="mb-1">
                        {chat.chatName ?? `chat ${index}`}
                    </p>

                    <p className="text-xs text-zinc-500">{(new Date(chat.updatedAt ?? '')).toLocaleDateString([], {hour: '2-digit',minute: '2-digit',})}</p>
                </button>
            ))}
            </div>
        </aside>
        <div className="flex-1 w-full max-h-screen overflow-hidden flex flex-col justify-center items-center">
            <div className="w-full text-zinc-500 p-3 flex flex-row items-center justify-between">
                <div>
                    <input
                        className="bg-zinc-900 p-3 rounded-lg outline-none focus:ring-2 focus:text-zinc-100"
                        type="text"
                        value={chatName ?? ''}
                        onChange={(e) => setChatName(e.target.value)}
                        onBlur={(e) => handleChangeChatName(e.target.value)}
                    />
                </div>

                <div className="p-1 flex flex-row gap-3">
                {userInfo?.username && <p>{userInfo!.username}</p>}
                    <button onClick={signOut}><CloseIcon /></button>
                </div>
            </div>
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
                    <div className="grow w-full md:max-w-3xl flex flex-col gap-3 pb-10">
                        {chatHistory.map((message, index) => (
                            <ChatMessage key={index} message={message} id={'msg' + index} typewriting={(index === chatHistory.length - 1) && (message.role === ChatRols.model)}/>
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
                    Chatbot - ProcessOptima
                </div>
            </div>
        </div>
    </main>
}