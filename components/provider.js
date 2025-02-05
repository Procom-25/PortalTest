// components/Provider.js
"use client"; // Mark this as a client component if using Next.js 13+ with the App Router

import { SessionProvider } from "next-auth/react";

export default function Provider({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}