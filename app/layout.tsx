import type { ReactNode } from "react";
import SfBanner from "./sf-banner";
import "./globals.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Factory app" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SfBanner />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
