"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddJobForm } from "@/components/add-job-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GradientButton } from "@/components/gradient-button"
import { useSession } from 'next-auth/react'
import { Job } from "@/lib/models/Job"

interface Resume {
  id: string
  applicantName: string
  resumeLink: string
}

export function JobList() {

  const [jobs, setJobs] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const company = useSession().data?.user?.name

  async function getJobs() {
    try {

      if (company) {
        const response = await fetch(
          `/api/jobs?${new URLSearchParams({ company })}`,
          {
            method: 'GET',
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseBody = await response.json();

        setJobs(responseBody["result"]);
      }

    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }

  const handleViewResumes = (job: Job) => {
    setSelectedJob(job)
  }

  const handleAddJob = async (newJob: Job) => {

    // console.log(JSON.stringify(newJob));

    try {
      const response = await fetch(
        `/api/jobs`,
        {
          method: 'POST',
          body: JSON.stringify(newJob),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();

      setJobs(responseBody["result"]);

    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }


  useEffect(() => {
    getJobs();
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Job Listings</h2>
          <p className="text-sm text-muted-foreground">Catch real time updates regarding your Job Listings!</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <GradientButton
              gradientFrom="from-[#199DDF]"
              gradientTo="to-[#145BD5]"
              hoverGradientFrom="from-[#199DDF]"
              hoverGradientTo="to-[#145BD5]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Job
            </GradientButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
            </DialogHeader>
            <AddJobForm onSubmit={handleAddJob} onClose={() => { setIsDialogOpen(false); getJobs() }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        {jobs ? <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.length > 0 ? jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {/* <span className="font-mono text-s text-muted-foreground">#{job.id}</span> */}
                    <span className="text-base">{job.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={job.status === "Open" ? "secondary" : "outline"} className="capitalize">
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-gray">
                  <div className="flex items-center gap-2 ">
                    <span className="text-base">{job.applicationDeadline}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end pr-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" onClick={() => handleViewResumes(job)}>
                          View Resumes {/* ({job.resumes.length}) */}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Resumes for {job.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          {job.resume && job.resumes.length > 0 ? (
                            <ul className="space-y-2">
                              {/* {job.resumes.map((resume) => (
                                <li key={resume.id}>
                                  <a
                                    href={resume.resumeLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {resume.applicantName}
                                  </a>
                                </li>
                              ))} */}
                            </ul>
                          ) : (
                            <p>No resumes available for this job.</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            )) : <p>No Jobs Added Placeholder</p>}
          </TableBody>
        </Table> : <p>Loading Placeholder</p>}
      </div>
    </div >
  )
}

