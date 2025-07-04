import Link from "next/link";
import "./globals.css";

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
        <header className="site-header">
          <p className="site-logo">
            <Link href="/p/start">It’s Me Magnus</Link>
          </p>
          <nav>
            <ul>
              <li>
                <Link href="/p/start">Start</Link>
              </li>
              <li>
                <Link href="/tags">All tags</Link>
              </li>
              <li>
                <Link href="/random">Random note</Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
