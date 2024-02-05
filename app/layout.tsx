"use client";

import { NextUIProvider } from "@nextui-org/react";
import "./styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
