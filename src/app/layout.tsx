import type { Metadata } from "next";
import "../index.css";
import logo from './logo.png'

export const metadata: Metadata = {
  title: "Peer With Me",
  description: "DN11 peer with me card.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={logo.src} />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
