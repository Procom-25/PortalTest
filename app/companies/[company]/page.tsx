"use client";

import { useState, useEffect } from "react";
import type React from "react"; // Added import for React
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

export default function JobListings({
  params,
}: {
  params: { company: string };
}) {
  const [jobs, setJobs] = useState(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const company = params.company;

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
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Application submitted", { resumeFile });
    setIsApplyDialogOpen(false);
    setSelectedJob(null);
    setResumeFile(null);
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overscroll-none">
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
                    className="rounded-xl border bg-card text-card-foreground hover:bg-secondary hover:cursor-pointer hover:shadow-md hover:shadow-[rgba(25,157,223,0.5)] transition-all duration-300"
                    onClick={() => setSelectedJob(job)}
                  >
                    <CardContent className="p-5 text-2xl text-center font-semibold opacity-70 hover:opacity-100">
                      <p>{job.title}</p>
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
                  [Logged in to google check comes here]
                </Label>
                {/* <Input id="name" placeholder="John Doe" required /> */}
              </div>
              <div>
                <Label htmlFor="resume">Resume Image</Label>
                <Input
                  id="resume"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {resumeFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    File selected: {resumeFile.name}
                  </p>
                )}
              </div>
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
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
