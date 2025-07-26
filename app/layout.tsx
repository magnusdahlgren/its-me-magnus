import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "MXGNS",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {auth}
      </body>
    </html>
  );
}
