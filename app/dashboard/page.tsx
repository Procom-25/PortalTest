"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardStats } from "@/components/dashboard-stats";
import { JobList } from "@/components/job-list";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
        <AppSidebar />
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
      {/* <AppSidebar /> */}
      <SidebarInset className="bg-gradient-to-b from-slate-50 to-slate-300">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b ">
          <div className="flex items-center gap-2 px-3">
            <div>P&apos; 25</div>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="font-bold">Procom &apos;25</div>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3">
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <div className=" flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="col-span-4">
              <h1 className=" px-8 pt-16 pb-4 text-3xl font-bold text-center tracking-tighter sm:text-6xl md:text-7xl">
                Procom '25 Job Portal
              </h1>
              <h1 className="px-4 lg:px-8 pt-4 pb-8 text-2xl font-light text-center tracking-tighter sm:text-3xl md:text-4xl">
                Welcome back, {session.user?.name}!
              </h1>
              <div className="h-full px-4 py-6 lg:px-8">
                <DashboardStats />
                <div className="mt-8">
                  <JobList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
