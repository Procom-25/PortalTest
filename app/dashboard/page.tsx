"use client";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div>
      <h1>Dashboard</h1>
      {name ? (
        <p>Welcome, {decodeURIComponent(name)}!</p>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}