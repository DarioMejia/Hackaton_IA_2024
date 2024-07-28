import { ChatRols, Message } from "@/lib/types";

const now= new Date();

const options = {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false
};

const formattedTime = (date: Date) => date.toLocaleTimeString([], options);

const ChatMessage = ({message, key, id}: 
    {   
        message: Message,
        key?: number,
        id?: string
    }) => {
    return (
        <div id={id} className={`flex w-full ${message.role === ChatRols.user ? "justify-end" :"justify-start"}`} key={key}>
            <div className="shadow-md max-w-[75%] min-w-[30%] bg-zinc-800 px-3 py-4 rounded-lg text-zinc-300">
                <p className="text-zinc-300">{message.text}</p>
                <span className="text-xs text-zinc-400">{formattedTime(message.date)}</span>
            </div>
        </div>
    );
};

export default ChatMessage;