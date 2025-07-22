import "./globals.css";
import { Header } from "@/components/Header";

export const metadata = {
  title: "MXGNS",
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
