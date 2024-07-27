'use client';

import React from "react";
import { FormEvent, useState } from "react";


export default function Page() {
    const [userMessage, setUserMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const res = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userMessage }),
        });

        const data = await res.json();
        setResponseMessage(data.message);
    };

    return (
        <div>
            <h1>ProcessOptima Chatbot</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Enter your message..."
                    rows={4}
                    cols={50}
                />
                <br />
                <button type="submit">Send</button>
            </form>
            {responseMessage && (
                <div>
                    <h2>Response:</h2>
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
}
