"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddJobForm } from "@/components/add-job-form"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GradientButton } from "@/components/gradient-button"
import { useSession } from 'next-auth/react'
import { Job } from "@/lib/models/Job"
import { EditJobForm } from "./edit-job-form"
import { NoJobsPlaceholder } from "@/components/no-jobs-placeholder"
import { LoadingPlaceholder } from "@/components/loading-placeholder"

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

    console.log(JSON.stringify(newJob));

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

  const handleUpdateJob = async (newJob: Job) => {

    console.log(JSON.stringify(newJob));

    try {
      const response = await fetch(
        `/api/jobs`,
        {
          method: 'PUT',
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
            <AddJobForm onSubmit={handleAddJob} onClose={() => { getJobs(); setIsDialogOpen(false); }} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md bg-[#FDFDFD]">
        {jobs ? <Table>
          <TableBody>
            {jobs.length > 0 ? jobs.map((job, index) => (
              <TableRow key={job.title}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2 ml-3">
                    {/* <span className="font-mono text-s text-muted-foreground">#{job.id}</span> */}
                    <span className="">{index + 1}.</span>
                  </div>
                </TableCell>

                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {/* <span className="font-mono text-s text-muted-foreground">#{job.id}</span> */}
                    <span className="font-">{job.title}</span>
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

                    <div className="flex justify-end pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="secondary" className="">
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit {job.title} Description</DialogTitle>
                          </DialogHeader>
                          <EditJobForm onClose={() => { getJobs(); setIsDialogOpen(false); }} onSubmit={handleUpdateJob} job={job} />
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-end pr-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          {/* TODO: Musab yahan delete button daldo koi acha sa dekh ke */}
                          <Button variant="secondary" className="text-[#FF0000]">
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle >Delete the {job.title} job post? </DialogTitle>
                          </DialogHeader>
                          <DialogFooter>
                            {/*TODO: Make the yes button more prominent (darker color) */}
                            <DialogTrigger asChild>
                              <Button className="text-white bg-red-500 hover:bg-red-600" onClick={() => handleDeleteJob(job)} variant="secondary">Yes</Button>
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
            )) : <NoJobsPlaceholder />}
          </TableBody>
        </Table> : <LoadingPlaceholder />}
      </div>
    </div >
  )
}

