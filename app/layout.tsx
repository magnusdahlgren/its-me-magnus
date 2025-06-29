import "./globals.css";

export const metadata = {
  title: "It's Me Magnus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <p className="site-logo">
            <a href="">It’s Me Magnus</a>
          </p>
          <nav>
            <ul>
              <li>
                <a href="">Start</a>
              </li>
              <li>
                <a href="">All tags</a>
              </li>
              <li>
                <a href="">Random note</a>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
