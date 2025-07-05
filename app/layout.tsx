import Link from "next/link";
import "./globals.css";
import { isAdmin } from "@/lib/auth";
import { Header } from "@/components/Header";

const admin = await isAdmin();

export const metadata = {
  title: "It's Me Magnus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
