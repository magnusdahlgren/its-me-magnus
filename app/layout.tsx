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
  modal,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {auth}
        {modal}
      </body>
    </html>
  );
}
