"use client";

import { ChatRols, Message } from "@/lib/types";
import Typewriter from 'typewriter-effect'; 

const now= new Date();

const options = {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false
};

const formattedTime = (date: Date) => date.toLocaleTimeString([], options);

const ChatMessage = ({message, key, id, typewriting}: 
    {   
        message: Message,
        key?: number,
        id?: string
        typewriting?: boolean
    }) => {
    
    return (
        <div id={id} className={`flex w-full ${message.role === ChatRols.user ? "justify-end" :"justify-start"}`} key={key}>
            <div className="shadow-md max-w-[75%] min-w-[30%] bg-zinc-800 px-3 py-4 rounded-lg text-zinc-300">
                <p className="text-zinc-300">
                    {!typewriting && message.text}
                    {typewriting && <Typewriter 
                        options={{
                            autoStart: true,
                            loop: false,
                            cursor: "",
                            delay: 1
                        }}
                        onInit={(typewriter) => { 
                        typewriter.typeString(message.text) 
                            .pauseFor(50) 
                            .start(); 
                        }
                        }/>
                    }
                </p>
                <span className="text-xs text-zinc-400">{formattedTime(message.date)}</span>
            </div>
        </div>
    );
};

export default ChatMessage;