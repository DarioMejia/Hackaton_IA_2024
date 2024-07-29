"use client";

import { useRouter } from "next/navigation";
import Typewriter from 'typewriter-effect'; 

export default function Home() {
    const router = useRouter();

    return (
        <main className="flex min-h-screen max-h-screen overflow-hidden bg-zinc-300 flex-col text-zinc-900">

            <header className="bg-zinc-200 h-14 w-full shadow-sm flex flex-row justify-center items-center p-10">

                <div className="flex flex-row justify-between items-center w-full max-w-[68rem]">
                    <div className="font-bold">ProcessOptima</div>
                    <div className="flex gap-4">
                        <button 
                            className="bg-zinc-900 text-zinc-100 rounded-full shadow px-5 py-1 hover:bg-gradient-to-r from-lime-400 to-yellow-500 hover:text-zinc-950 hover:border-zinc-900 hover:border-2"
                            onClick={() => router.push('/auth/signin')}>Sign In</button>
                        <button
                            className="rounded-full shadow px-5 py-1 border-zinc-900 border-2 hover:bg-gradient-to-r from-lime-400 to-yellow-500"
                            onClick={() => router.push('/auth/signup')}>Sign Up
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-grow flex justify-center items-center text-zinc-950">

                <div className="text-center max-w-[70%] flex flex-col gap-5 justify-center items-center">
                    <p className="text-caption font-bold text-lg">ProcessOptima IA</p>

                    
                    <h1 className="my-5 text-2xl md:text-5xl text-balance ">
                        <Typewriter 
                        options={{
                            autoStart: true,
                            loop: false,
                        }}
                        onInit={(typewriter) => { 
                        typewriter.typeString('Resolve your doubts. Inspire your creativity. Produce your ideas.') 
                            .pauseFor(2500) 
                            .start(); 
                        }} 
                    /> 
                    </h1>
                    <p className="text-balance">
                        ProcessOptima is a virtual assistant that helps you with your doubts, 
                        inspires your creativity and helps you produce your ideas. 
                        Get started now and start chatting with ProcessOptima.
                    </p>
                    <button
                        className="rounded-full block w-fit shadow px-5 py-4 border-zinc-900 border-2 bg-gradient-to-r from-lime-400 to-yellow-500 text-lg"
                        onClick={() => router.push('/chat')}>
                        Get Started
                    </button>
                </div>
                
            </div>
        </main>
    );
}