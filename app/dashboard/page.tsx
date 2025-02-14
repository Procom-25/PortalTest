"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { JobList } from "@/components/job-list";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { Card, CardContent } from "@/components/ui/card";

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
      <SidebarInset className="h-full bg-gradient-to-b overscroll-none ">
        <header className="flex h-16 shrink-0 items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src="https://www.procom.com.pk/Procom-Logo.png"
                className="ml-4 mt-1 w-5 h-8"
                alt="Procom Logo"
              />
            </Avatar>
            <Separator orientation="vertical" className="h-6" />
            <div className="font-bold text-lg">Procom &apos;25</div>
          </div>
          <div className="flex items-center gap-4 ">
            <Button
              onClick={() => signOut()}
              className="border bg-transparent text-black hover:bg-white hover:text-black transition-colors duration-200 p-3 flex items-center gap-2"
            >
              <LogOut className=" h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="pb-5">
            <Card className=" mx-[10%] relative overflow-hidden rounded-2xl bg-cover bg-center text-white" style={{ backgroundImage: "url('/cover.png')" }}>
              <div className="absolute inset-0 bg-black/25" /> {/* Dark overlay */}
              <CardContent className="relative z-10 py-12 text-center">
                <h2 className="text-2xl md:text-3xl font-normal tracking-tighter">
                  Procom &apos;25
                </h2>
                <h1 className="text-7xl sm:text-7xl md:text-8xl font-bold tracking-tighter mb-4">
                  Job Portal
                </h1>
                <h2 className="text-2xl md:text-3xl font-light tracking-tighter mb-8">
                  Welcome back, {session?.user?.name}.
                </h2>
              </CardContent>
            </Card>
          </div>
          <div className="px-[10%]">
            <DashboardStats />
            <div className="mt-16">
              <JobList />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
