import "./globals.css";
import { Header } from "@/components/Header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

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
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
