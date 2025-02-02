"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddJobForm } from "@/components/add-job-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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

  const handleDeleteJob = async (job: Job) => {
    try {
      const response = await fetch(
        `/api/jobs?${new URLSearchParams({ company: job.company, title: job.title })}`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      getJobs();

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

                {/* View Resumes Button */}
                <TableCell>
                  <div className="flex justify-end">
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

                    {/* Delete Button */}
                    <div className="flex justify-end pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          {/* TODO: Musab yahan delete button daldo koi acha sa dekh ke */}
                          <Button variant="secondary" className="delete-button">
                            <svg className="delete-icon" width="20" height="20" fill="none">
                              <path d="M18 6V16.2C18 17.8802 18 18.7202 17.673 19.362C17.3854 19.9265 16.9265 20.3854 16.362 20.673C15.7202 21 14.8802 21 13.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                stroke="red" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                          </DialogHeader>
                          <DialogFooter>
                            {/*TODO: Make the yes button more prominent (darker color) */}
                            <DialogTrigger asChild>
                              <Button onClick={() => handleDeleteJob(job)} variant="secondary">Yes</Button>
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
            )) : <p>No Jobs Added Placeholder</p>}
          </TableBody>
        </Table> : <p>Loading Placeholder</p>}
      </div>
    </div >
  )
}

