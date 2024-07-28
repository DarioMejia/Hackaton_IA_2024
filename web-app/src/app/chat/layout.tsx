import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {  AuthContextProvider } from "@/providers/authProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat | ProcessOptima",
  description: "Hackaton IA Julio 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
    </body>
    </html>
  );
}
