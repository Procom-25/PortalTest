"use client"; // Mark this component as a client component

import { DashboardStats } from "@/components/dashboard-stats";
import { JobList } from "@/components/job-list";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect
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

export default function Page() {
  const { data: session } = useSession();
  const router = useRouter();

  console.log("Session:", session); // Debugging

  // Use useEffect to handle redirection on the client side
  useEffect(() => {
    if (!session) {
      console.log("No session found, redirecting to login page");
      router.push("/login");
    }
  }, [session, router]);

  // If there's no session, return null or a loading state
  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">DashBoard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Homepage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3">
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="col-span-4">
              <h1 className="px-4 lg:px-8 text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                Dashboard
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