import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miru Scale — AI Client Systems für Online Coaches",
  description:
    "Automatisiertes Lead-Qualification, Follow-Up & Call-Booking System. Mehr Calls, weniger Chaos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
