"use client"; // Mark this as a Client Component

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  console.log("Session:", session); // Debugging

  if (!session) {
    console.log("No session found, redirecting to login page");
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name || "User"}</h1>
      <button onClick={() => signOut({ callbackUrl: "/login" })}>Sign Out</button>
    </div>
  );
}