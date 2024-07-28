import { ChatRols, Message } from "@/lib/types";

const ChatMessage = ({message, key, id}: 
    {
        message: Message,
        key?: number,
        id?: string
    }) => {
    return (
        <div id={id} className={`flex ${message.role === ChatRols.user ? "justify-end" : "justify-start"} mb-4 `} key={key}>
            <div className={`shadow-md max-w-[1/2] bg-zinc-600 p-2 rounded-lg ${message.role === ChatRols.user ? " bg-red-900 " : "bg-green-800 text-black"}`}>
                <p>{message.text}</p>
                <span className="text-xs text-gray-500">{message.date.toLocaleTimeString()}</span>
            </div>
        </div>
    );
};

export default ChatMessage;