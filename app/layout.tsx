import type { Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import NavBar from "@/components/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className="w-screen h-screen ">
          <NavBar />
          <div className="p-8">{children}</div>
        </body>
      </UserProvider>
    </html>
  );
}
