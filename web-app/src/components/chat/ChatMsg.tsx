import { ChatRols, Message } from "@/lib/types";

const now= new Date();
const options = {
    hour:'2-digits',
    minute: '2-digits',
    hour12:false
};

const formattedTime = now.toLocaleTimeString([], options);


const ChatMessage = ({message, key, id}: 
    {   
        message: Message,
        key?: number,
        id?: string
    }) => {
    return (
        <div id={id} className={`flex ${message.role === ChatRols.user ? "justify-end" : "justify-start"} mb-4 `} key={key}>
            <div className={`shadow-md max-w-[1/2] bg-zinc-400 p-2 rounded-lg ${message.role === ChatRols.user ? " bg-red-900 " : "bg-green-800 text-white"}`}>
                <p>{message.text}</p>
                <span className="text-xs text-white">{formattedTime()}</span>
            </div>
        </div>
    );
};

export default ChatMessage;