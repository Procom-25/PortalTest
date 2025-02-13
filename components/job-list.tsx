"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Download, Eye } from "lucide-react";
import { AddJobForm } from "@/components/add-job-form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GradientButton } from "@/components/gradient-button";
import { useSession } from "next-auth/react";
import type { Job } from "@/lib/models/Job";
import { EditJobForm } from "./edit-job-form";
import { NoJobsPlaceholder } from "@/components/no-jobs-placeholder";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

interface Resume {
  email: string;
  cv_url: string;
  applied_at: string;
}

interface JobWithApplicants extends Job {
  applicantCount: number;
  resumes?: Resume[];
}

export function JobList() {
  const [jobs, setJobs] = useState<JobWithApplicants[] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobWithApplicants | null>(
    null
  );
  const { data: session } = useSession();
  const company = session?.user?.name;

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
        const jobsData = responseBody.result || [];

        // Fetch applicant counts and resumes for each job in one go
        const jobsWithData = await Promise.all(
          jobsData.map(async (job: Job) => {
            const cvResponse = await fetch(
              `/api/get-cvs?${new URLSearchParams({
                company: company,
                job_title: job.title,
              })}`,
              {
                method: "GET",
              }
            );

            if (!cvResponse.ok) {
              return { ...job, applicantCount: 0, resumes: [] };
            }

            const cvData = await cvResponse.json();
            return {
              ...job,
              applicantCount: cvData.resumes?.length || 0,
              resumes: cvData.resumes || [],
            };
          })
        );

        setJobs(jobsWithData);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    }
  }

  const handleViewResumes = (job: JobWithApplicants) => {
    setSelectedJob(job);
  };

  const handleDownloadCV = async (cvUrl: string, email: string) => {
    try {
      const response = await fetch(
        `/api/download-cv?url=${encodeURIComponent(cvUrl)}`
      );
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const extension = cvUrl.split(".").pop()?.toLowerCase() || "pdf";
      a.download = `CV-${email}.${extension}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading CV:", error);
    }
  };

  const handleViewCV = async (cvUrl: string) => {
    try {
      const response = await fetch(
        `/api/download-cv?url=${encodeURIComponent(cvUrl)}`
      );
      if (!response.ok) throw new Error("Failed to fetch CV");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const extension = cvUrl.split(".").pop()?.toLowerCase();

      const viewer = window.open("", "_blank");
      if (viewer) {
        if (extension === "pdf") {
          viewer.document.write(`
            <iframe 
              src="${url}" 
              style="width:100%; height:100vh; border:none;"
            ></iframe>
          `);
        } else if (["doc", "docx"].includes(extension || "")) {
          viewer.document.write(`
            <iframe 
              src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                cvUrl
              )}" 
              style="width:100%; height:100vh; border:none;"
            ></iframe>
          `);
        }
        viewer.onload = () => window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error viewing CV:", error);
    }
  };

  const handleDownloadZip = async (job: Job) => {
    try {
      const response = await fetch(
        `/api/download-cv-bulk?${new URLSearchParams({
          company: company || "",
          job_title: job.title,
        })}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${job.title}-Resumes.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (error) {
      console.error("Error downloading resumes:", error);
    }
  };

  const handleAddJob = async (newJob: Job) => {
    try {
      const response = await fetch(`/api/jobs`, {
        method: "POST",
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      getJobs();
    } catch (error) {
      console.error("Error adding job:", error);
    }
  };

  const handleUpdateJob = async (newJob: Job) => {
    try {
      const response = await fetch(`/api/jobs`, {
        method: "PUT",
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      getJobs();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async (job: Job) => {
    try {
      const response = await fetch(
        `/api/jobs?${new URLSearchParams({
          company: job.company,
          title: job.title,
        })}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      getJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  useEffect(() => {
    if (company) {
      getJobs();
    }
  }, [company]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Job Listings
          </h2>
          <p className="text-sm text-muted-foreground">
            Catch real time updates regarding your Job Listings!
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <GradientButton
              gradientFrom="from-[#199DDF]"
              gradientTo="to-[#145BD5]"
              hoverGradientFrom="from-[#199DDF]"
              hoverGradientTo="to-[#145BD5]"
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </GradientButton>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
            </DialogHeader>
            <AddJobForm
              onSubmit={handleAddJob}
              onClose={() => {
                getJobs();
                setIsDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md bg-[#FDFDFD] overflow-x-auto">
        {jobs === null ? (
          <LoadingPlaceholder />
        ) : jobs.length > 0 ? (
          <Table>
            <TableBody>
              {jobs.map((job: JobWithApplicants, index: number) => (
                <TableRow
                  key={`${job.title}-${index}`}
                  className="flex flex-col sm:table-row"
                >
                  <TableCell className="font-medium sm:w-1/12">
                    <div className="flex items-center gap-2 ml-3">
                      <span className="">{index + 1}.</span>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium sm:w-3/12">
                    <div className="flex items-center gap-2 ml-3">
                      <span className="font-medium">{job.title}</span>
                    </div>
                  </TableCell>

                  <TableCell className="sm:w-8/12">
                    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2 sm:gap-4">
                      <div className="flex items-center">
                        <span className="px-3 py-1 rounded-full mr-4 bg-green-100 text-green-800 text-sm font-medium">
                          {job.applicantCount} Applicants
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              onClick={() => handleViewResumes(job)}
                            >
                              View Resumes
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Resumes for {job.title}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 max-h-[60vh] overflow-y-auto">
                              {job.resumes && job.resumes.length > 0 ? (
                                <ul className="space-y-2">
                                  {job.resumes.map((resume, idx) => (
                                    <li
                                      key={idx}
                                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 hover:bg-gray-50 rounded"
                                    >
                                      <span className="mb-2 sm:mb-0">
                                        {resume.email}
                                      </span>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleViewCV(resume.cv_url)
                                          }
                                        >
                                          <Eye className="h-4 w-4 mr-1" />
                                          View
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            handleDownloadCV(
                                              resume.cv_url,
                                              resume.email
                                            )
                                          }
                                        >
                                          <Download className="h-4 w-4 mr-1" />
                                          Download
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                  <Button
                                    onClick={() => handleDownloadZip(job)}
                                  >
                                    Download All
                                  </Button>
                                </ul>
                              ) : (
                                <p>No resumes available for this job.</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="secondary">Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Edit {job.title} Description
                              </DialogTitle>
                            </DialogHeader>
                            <EditJobForm
                              onClose={() => {
                                getJobs();
                                setIsDialogOpen(false);
                              }}
                              onSubmit={handleUpdateJob}
                              job={job}
                            />
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              className="text-[#FF0000]"
                            >
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Delete the {job.title} job post?
                              </DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogTrigger asChild>
                                <Button
                                  className="text-white bg-red-500 hover:bg-red-600"
                                  onClick={() => handleDeleteJob(job)}
                                  variant="secondary"
                                >
                                  Yes
                                </Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button variant="secondary">No</Button>
                              </DialogTrigger>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <NoJobsPlaceholder />
        )}
      </div>
    </div>
  );
}
