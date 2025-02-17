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
import { LogOut } from "lucide-react";

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
  const [company, setCompany] = useState<string>("");

  useEffect(() => {
    if (params.company) {
      setCompany(decodeURIComponent(params.company));
    }
  }, [params.company]);

  const handleLogout = () => {
    signOut({
      callbackUrl: `/companies/${company}`,
    });
    toast.success("Successfully logged out");
  };

  const handleLogin = () => {
    signIn("google", {
      callbackUrl: `/companies/${company}`,
      prompt: "select_account",
    });
  };

  // Only fetch applied jobs once when session and company are available
  useEffect(() => {
    const getAppliedJobs = async () => {
      if (session?.user?.email && company) {
        try {
          const response = await fetch(
            `/api/applied-jobs?email=${session.user.email}&company=${company}`
          );
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

    getAppliedJobs();
  }, [session?.user?.email, company]);

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
      signIn("google", {
        callbackUrl: `/companies/${company}`,
        prompt: "select_account",
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
        formData.append("resume", resumeFile);
      }
      const userId = session?.user?.email || "";
      formData.append("userId", userId);
      formData.append("name", session.user?.name || "");
      formData.append("email", session.user?.email || "");
      formData.append("company", company || "");
      formData.append("job_title", selectedJob?.title || "");

      const response = await fetch("/api/post-cvs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      const result = await response.json();
      console.log("Application submitted successfully:", result);

      if (selectedJob) {
        setAppliedJobs([...appliedJobs, selectedJob.title]);
      }

      setIsApplyDialogOpen(false);
      setSelectedJob(null);
      setResumeFile(null);
      toast.success("Application submitted successfully");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  const handleJobClick = (job: Job) => {
    if (!session) {
      signIn("google", {
        callbackUrl: `/companies/${company}`,
        prompt: "select_account",
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

  return (
    <div className="min-h-screen max-h-screen flex flex-col lg:flex-row overscroll-none bg-gradient-to-r from-white from-60% to-gray-200 to-90%">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {session ? (
          <>
            <div className="flex items-center gap-4 ">
            <Button
              onClick={() => signOut()}
              className="border bg-white text-black hover:bg-white hover:text-black transition-colors duration-200 p-3 flex items-center gap-2"
            >
              <LogOut className=" h-4 w-4" />
              Sign out
            </Button>
          </div>
          </>
        ) : (
          <Button
            onClick={handleLogin}
            className=" px-6 border bg-white text-black hover:bg-white hover:text-black transition-colors duration-200 p-3 flex items-center gap-2"
          >
            Login
          </Button>
        )}
      </div>

      <div className="relative bg-muted w-full lg:w-[40%] h-[300px] lg:h-auto overscroll-none hidden m-4 rounded-xl lg:block">
        <div className="relative w-full h-full">
          <Image
            src="/231.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="dark:brightness-[0.2] dark:grayscale rounded-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-xl pointer-events-none"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-8">
          <div className="flex items-center gap-2 p-4">
            <div className="w-6 h-10">
              <img
                src="https://www.procom.com.pk/Procom-Logo.png"
                alt="Company Logo"
                className="w-full h-full"
              />
            </div>
            
          </div>
          <div className="space-y-2">
            {/* <p className="text-xl sm:text-lg text-white animate-fade-in-up text-left p-4">
              we make it happen !
            </p> */}
          </div>
        </div>
      </div>
      <div className="flex-1 p-2 lg:p-2 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col px-10">
          <div className="mb-8">
            <h2 className="md:text-6xl text-4xl font-bold mb-2">
              {company}
            </h2>
            <p className="ml-1">              
              Take the next step in your career by applying for your dream position at {company} today.
            </p>
          </div>
          <ScrollArea className="h-[74vh] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div className="space-y-3 p-0">
              {jobs && jobs.length > 0 ? (
                jobs.map((job: Job) => (
                  <Card
                    key={job.title}
                    className={`rounded-xl border border-gray-300 bg-white/80 backdrop-blur-md shadow-md 
                      hover:bg-gray-100 hover:shadow-lg
                      transition-all duration-300 ease-in-out
                      px-3 py-2 text-sm font-medium text-gray-800
                      ${
                        appliedJobs.includes(job.title)
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:ring-2 hover:ring-gray-300"
                      }`}
                    onClick={() => handleJobClick(job)}
                  >
                    <CardContent className="py-5 text-black text-2xl sm:text-2xl font-semibold opacity-70 hover:opacity-100 text-center flex justify-between items-center">
                      <p>{job.title}</p>
                      {appliedJobs.includes(job.title) && (
                        <p className="text-sm text-green-600">Already Applied</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-gray-500">There are no job posts.</p>
              )}
            </div>
          </ScrollArea>

        </div>
      </div>

      {/* Job Details Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="w-[90%] md:w-[500] mx-auto rounded-xl p-6">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title}</DialogTitle>
            <DialogDescription>{selectedJob?.description}</DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8">
            <Button
              // className="hover:bg-green-700 bg-green-600 rounded-lg"
              onClick={() => setIsApplyDialogOpen(true)}
            >
              Apply Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="w-[90%] md:w-[500] rounded-xl p-5 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold ">
              Apply for {selectedJob?.title}
            </DialogTitle>
            {/* <DialogDescription className="text-sm text-gray-600 text-center">
        Please fill out the form below to apply for this position.
      </DialogDescription> */}
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                {session
                  ? `Logged in as: ${session.user?.name}`
                  : "Please sign in to apply"}
              </Label>
            </div>

            {session && (
              <div className="space-y-3">
                <Label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700"
                >
                  
                </Label>
                <div className="mt-1 flex flex-col items-center justify-center px-4 py-3 border-2 border-dashed rounded-md hover:border-gray-500 transition">
                  <svg
                    className="h-10 w-10 text-gray-400 mb-2"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-sm text-gray-600 text-center">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer rounded-md font-bold  text-lg focus:outline-none"
                    >
                      <span>Upload your resume</span>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="mt-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC up to 10MB
                  </p>
                </div>

                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    File selected: {resumeFile.name}
                  </p>
                )}
              </div>
            )}

            <DialogFooter className="flex justify-end gap-2 !mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsApplyDialogOpen(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                // className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                type="submit"
              >
                {session ? "Submit Application" : "Sign in with Google"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
