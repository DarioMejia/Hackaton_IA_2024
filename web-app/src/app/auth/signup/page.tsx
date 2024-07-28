'use client'

import { signUp } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';

import * as yup from 'yup';
import { useState } from "react";

const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

export default function Page() {
    
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    
    const {
        errors,
        touched,
        values,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
          username: "",
          email: "",
          password: "",
        },
        validationSchema: schema,
        onSubmit: async (values) => {
            try {
                await signUp(values.email, values.password);
                router.push('/chat');
            } catch (error: any) {
                let errorMessage = "An unexpected error occurred.";

                switch (error.code) {
                    case 'auth/wrong-password':
                        errorMessage = "Incorrect password.";
                        break;
                    case 'auth/user-not-found':
                        errorMessage = "No user found with this email.";
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = "Too many requests. Try again later.";
                        break;
                    case 'auth/invalid-credential':
                        errorMessage = "Invalid credentials provided.";
                        break;
                    // Add more cases as needed
                    default:
                        errorMessage = error.message;
                }
                setError(errorMessage);
            }
        },
    });

    
    return (
        <main className="flex min-h-screen max-h-screen overflow-hidden bg-zinc-900 items-center justify-center flex-col">
            <div className="bg-zinc-700 p-10 rounded-xl shadow-lg bg-gradient-to-r from-zinc-700 to-zinc-800">
                <p className="text-lg text-center text-zinc-400">Process Optima</p>
                <h1 className="text-3xl font-bold text-center my-5 bg-gradient-to-r from-lime-400 to-yellow-500 bg-clip-text text-transparent">Welcome!</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col items-center">

                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={values.username}
                        onChange={(e) => {
                            setError(null);
                            handleChange(e);
                        }}
                        className="p-2 rounded-lg my-2 px-5 bg-gradient-to-r from-zinc-600 to-zinc-700 outline-none focus:outline-white opacity-80 focus:opacity-100 text-zinc-100"
                    />

                    {touched.username && errors.username && <p className="text-sm text-red-300">{errors.username}</p>}

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={values.email}
                        onChange={(e) => {
                            setError(null);
                            handleChange(e);
                        }}
                        className="p-2 rounded-lg my-2 px-5 bg-gradient-to-r from-zinc-600 to-zinc-700 outline-none focus:outline-white opacity-80 focus:opacity-100 text-zinc-100" 
                    />

                    {touched.email && errors.email && <p className="text-sm text-red-300">{errors.email}</p>}

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={values.password}
                        onChange={(e) => {
                            setError(null);
                            handleChange(e);
                        }}
                        className="p-2 rounded-lg my-2 px-5 bg-gradient-to-r from-zinc-600 to-zinc-700 outline-none focus:outline-white opacity-80 focus:opacity-100 text-zinc-100"
                    />

                    {touched.password && errors.password && <p className="text-sm text-red-300">{errors.password}</p>}

                    <button type="submit" className="bg-zinc-500 text-white p-2 rounded-lg my-5 hover:bg-gradient-to-r from-emerald-500 to-lime-600 hover:font-bold shadow-md">Ingresar</button>
                </form>

                {error && <p className="text-red-300 text-center">{error}</p>}
            </div>
        </main>
    );
}