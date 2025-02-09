"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { LoadingPlaceholder } from "@/components/loading-placeholder";
import { Job } from "@/lib/models/Job";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JobListings({
  params,
}: {
  params: { company: string };
}) {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [company, setCompany] = useState<string>('');

  useEffect(() => {
    if (params.company) {
      setCompany(decodeURIComponent(params.company));
    }
  }, [params.company]);

  const handleLogout = async () => {
    await signOut({ 
      redirect: false 
    });

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    localStorage.clear();
    sessionStorage.clear();

    toast.success("Successfully logged out");

    router.push(`/companies/${company}`);
  };

  const handleLogin = async () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  
    localStorage.clear();
    sessionStorage.clear();
  
    await signOut({ redirect: false });
  
    await signIn('google', { 
      callbackUrl: `/companies/${company}`, 
      prompt: 'select_account' 
    });

    toast.success("Successfully logged in");
  };

  const getAppliedJobs = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/applied-jobs?email=${session.user.email}&company=${company}`)
        ;
        if (response.ok) {
          const data = await response.json();
          const appliedJobTitles = data.jobs.map((job: any) => job.job);
          setAppliedJobs(appliedJobTitles);
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    }
  };
  
  async function getJobs() {
    try {
      if (company) {
        const response = await fetch(
          `/api/jobs?${new URLSearchParams({ company })}`,
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseBody = await response.json();

        setJobs(responseBody["result"]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
      toast.success("File selected successfully");
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn('google', {
        callbackUrl: `/companies/${company}`
      });
      return;
    }

    if (selectedJob && appliedJobs.includes(selectedJob.title)) {
      toast.error("You have already applied for this position");
      setIsApplyDialogOpen(false);
      return;
    }

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      // Get sub property from session token which contains the user ID
      const userId = (session as any)?.token?.sub || '';
      formData.append('userId', userId);
      formData.append('name', session.user?.name || '');
      formData.append('email', session.user?.email || '');
      formData.append('company', company || '');
      formData.append('job_title', selectedJob?.title || '');

      const response = await fetch('/api/post-cvs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const result = await response.json();
      console.log('Application submitted successfully:', result);
      
      if (selectedJob) {
        setAppliedJobs([...appliedJobs, selectedJob.title]);
      }
      
      setIsApplyDialogOpen(false);
      setSelectedJob(null);
      setResumeFile(null);
      toast.success("Application submitted successfully");
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error("Failed to submit application");
    }
  };

  const handleJobClick = (job: Job) => {
    if (!session) {
      signIn('google', {
        callbackUrl: `/companies/${company}`
      });
      return;
    }

    if (appliedJobs.includes(job.title)) {
      toast.error("You have already applied for this position");
      return;
    }

    setSelectedJob(job);
  };

  useEffect(() => {
    if (company) {
      getJobs();
    }
  }, [company]);

  useEffect(() => {
    if (session?.user?.email && company) {
      getAppliedJobs();
    }
  }, [session, company]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overscroll-none">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {session ? (
          <>
            <Button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Login with Google
          </Button>
        )}
      </div>

      <div className="relative bg-muted w-full lg:w-[40%] h-[300px] lg:h-auto overscroll-none">
        <Image
          src="/comp.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col justify-between p-8">
          <div className="flex items-center gap-2 p-4">
            <div className="w-6 h-8 ">
              <img
                src="https://www.procom.com.pk/Procom-Logo.png"
                alt="Company Logo"
                className="w-full h-full"
              />
            </div>
            <span className="font-bold text-4xl pl-2 text-white">
              {company}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-xl sm:text-lg text-white animate-fade-in-up text-left p-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque
              perspiciatis beatae maxime exercitationem suscipit nihil sit?
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-8 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col px-10">
          <div className="my-8">
            <h2 className="md:text-6xl text-5xl font-bold tracking-tighter md:text-left text-center">
              Job Listings
            </h2>
          </div>
          <ScrollArea className="h-[80vh] pr-4">
            <div className="space-y-3 p-4">
              {jobs ? (
                jobs.map((job: Job) => (
                  <Card
                    key={job.title}
                    className={`rounded-xl border bg-card text-card-foreground transition-all duration-300 ${
                      appliedJobs.includes(job.title)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-secondary hover:cursor-pointer hover:shadow-md hover:shadow-[rgba(25,157,223,0.5)]"
                    }`}
                    onClick={() => handleJobClick(job)}
                  >
                    <CardContent className="p-5 text-2xl text-center font-semibold">
                      <p>{job.title}</p>
                      {appliedJobs.includes(job.title) && (
                        <p className="text-sm text-green-600">Already Applied</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <LoadingPlaceholder />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.description}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              className="hover:bg-green-700 bg-green-600"
              onClick={() => setIsApplyDialogOpen(true)}
            >
              {"Apply Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Please fill out the form below to apply for this position.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {session ? `Logged in as: ${session.user?.name}` : 'Please sign in to apply'}
                </Label>
              </div>
              {session && (
                <div className="space-y-2">
                  <Label htmlFor="resume" className="block text-sm font-medium">
                    Upload Resume
                  </Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md hover:border-primary transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-muted-foreground" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-muted-foreground">
                        <label htmlFor="resume" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none">
                          <span>Upload a file</span>
                          <Input
                            id="resume"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="sr-only"
                            onChange={handleFileChange}
                            required
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-muted-foreground">PDF, DOC up to 10MB</p>
                    </div>
                  </div>
                  {resumeFile && (
                    <p className="text-sm text-muted-foreground mt-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      File selected: {resumeFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button className="hover:bg-green-700 bg-green-600" type="submit">
                {session ? 'Submit Application' : 'Sign in with Google'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}  
