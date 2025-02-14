"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { JobList } from "@/components/job-list";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSkeleton from "@/components/DashboardSkeleton";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      console.log("No session found, redirecting to login page");
      router.push("/login");
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <SidebarProvider>
        <SidebarInset>
          <DashboardSkeleton />
        </SidebarInset>
      </SidebarProvider>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <SidebarInset className="h-full bg-gradient-to-b from-slate-50 to-slate-300">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://www.procom.com.pk/Procom-Logo.png" className="ml-2 w-6 h-10" alt="Procom Logo" />
              
            </Avatar>
            <Separator orientation="vertical" className="h-6" />
            <div className="font-bold text-lg">Procom &apos;25</div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="destructive" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold text-center tracking-tighter sm:text-5xl md:text-6xl mb-4">
            Procom &apos;25 Job Portal
          </h1>
          <h2 className="text-xl font-light text-center tracking-tighter sm:text-2xl md:text-3xl mb-8">
            Welcome back, {session.user?.name}!
          </h2>
          <DashboardStats />
          <div className="mt-8">
            <JobList />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
