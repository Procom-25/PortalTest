"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddJobForm } from "@/components/add-job-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { GradientButton } from "@/components/gradient-button"

interface Resume {
  id: string
  applicantName: string
  resumeLink: string
}

interface Job {
  id: number
  title: string
  status: "Open" | "Closed"
  resumes: Resume[]
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    status: "Open",
    resumes: [
      { id: "r001", applicantName: "John Doe", resumeLink: "/resumes/john-doe.pdf" },
      { id: "r002", applicantName: "Jane Smith", resumeLink: "/resumes/jane-smith.pdf" },
    ],
  },
  {
    id: 2,
    title: "Devops Engineer",
    status: "Closed",
    resumes: [{ id: "r003", applicantName: "Alice Johnson", resumeLink: "/resumes/alice-johnson.pdf" }],
  },
]

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const handleViewResumes = (job: Job) => {
    setSelectedJob(job)
  }

  const handleAddJob = (newJob: Omit<Job, "id" | "resumes">) => {
    const jobToAdd: Job = {
      ...newJob,
      id: jobs.length + 1,
      resumes: [],
    }
    setJobs([...jobs, jobToAdd])
    setIsDialogOpen(false)
  }

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
            <AddJobForm onSubmit={handleAddJob} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-s text-muted-foreground">#{job.id}</span>
                    <span className="text-base">{job.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={job.status === "Open" ? "secondary" : "outline"} className="capitalize">
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end pr-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" onClick={() => handleViewResumes(job)}>
                          View Resumes ({job.resumes.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Resumes for {job.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          {job.resumes.length > 0 ? (
                            <ul className="space-y-2">
                              {job.resumes.map((resume) => (
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
                              ))}
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

