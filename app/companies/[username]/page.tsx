"use client"

import { useState } from "react"
import type React from "react" // Added import for React
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface JobListing {
  id: string
  title: string
  description: string
  status: "Open" | "Closed"
}

const jobListings: JobListing[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    description:
      "We are seeking an experienced frontend developer to join our team. The ideal candidate will have strong skills in React, TypeScript, and modern web technologies.",
    status: "Open",
  },
  {
    id: "2",
    title: "Product Designer",
    description:
      "Join our design team to create intuitive and beautiful user interfaces. Experience with Figma and user-centered design principles is required.",
    status: "Open",
  },
  {
    id: "3",
    title: "Backend Engineer",
    description:
      "We're looking for a backend engineer to help scale our infrastructure. Proficiency in Node.js, databases, and cloud technologies is essential.",
    status: "Closed",
  },
  {
    id: "4",
    title: "UI/UX Designer",
    description:
      "Help us create delightful user experiences across our product line. Strong portfolio showcasing web and mobile design work is required.",
    status: "Open",
  },
  {
    id: "5",
    title: "DevOps Engineer",
    description:
      "Join our operations team to build and maintain our cloud infrastructure. Experience with AWS, Docker, and CI/CD pipelines is crucial.",
    status: "Open",
  },
  {
    id: "6",
    title: "Full Stack Developer",
    description:
      "We're seeking a versatile developer comfortable with both frontend and backend technologies. Experience with React, Node.js, and databases is required.",
    status: "Open",
  },
  {
    id: "7",
    title: "Technical Lead",
    description:
      "Lead a team of developers in building our next-generation products. Strong technical skills and leadership experience are essential.",
    status: "Open",
  },
  {
    id: "8",
    title: "Software Engineer",
    description:
      "Join our engineering team to build scalable and efficient software solutions. Proficiency in at least one programming language and software design principles is required.",
    status: "Open",
  },
  {
    id: "9",
    title: "Data Scientist",
    description:
      "Help us derive insights from our data. Strong background in statistics, machine learning, and data visualization is required.",
    status: "Closed",
  },

  {
    id: "10",
    title: "Product Manager",
    description:
      "Lead the development of our products from ideation to launch. Strong product sense and communication skills are essential.",
    status: "Open",
  },
  {
    id: "11",
    title: "Sales Manager",
    description:
      "Manage our sales team and drive revenue growth. Strong sales experience and leadership skills are required.",
    status: "Open",
  },
  {
    id: "12",
    title: "Customer Support Specialist",
    description:
      "Help our customers succeed by providing timely and helpful support. Strong communication skills and empathy are essential.",
    status: "Open",
  },
  {
    id: "13",
    title: "Marketing Manager",
    description:
      "Lead our marketing efforts to drive brand awareness and customer acquisition. Strong marketing experience and analytical skills are required.",
    status: "Open",
  },
]

export default function JobListings({ params }: { params: { username: string } }) {
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const company = params.username
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0])
    }
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Application submitted", { resumeFile })
    setIsApplyDialogOpen(false)
    setSelectedJob(null)
    setResumeFile(null)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="relative bg-muted w-full lg:w-[40%] h-[300px] lg:h-auto">
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
              <img src="https://www.procom.com.pk/Procom-Logo.png" alt="Company Logo" className="w-full h-full" />
            </div>
            <span className="font-bold text-4xl pl-2 text-white">{company}</span>
          </div>
          <div className="space-y-2">
            <p className="text-xl sm:text-lg text-white animate-fade-in-up text-left p-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque perspiciatis beatae maxime exercitationem
              suscipit nihil sit?
            </p>
          </div>
          
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-8 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-6xl text-center">Job Listings</h1>
          </div>
          <ScrollArea className="h-[80vh] pr-4">
            <div className="space-y-3 p-4">
              {jobListings.map((job) => (
                <Card
                  key={job.id}
                  className="rounded-xl border bg-card text-card-foreground hover:bg-secondary hover:cursor-pointer hover:shadow-md hover:shadow-[rgba(25,157,223,0.5)] transition-all duration-300"
                  onClick={() => setSelectedJob(job)}
                >
                  <CardContent className="p-5 text-2xl text-center font-semibold opacity-70 hover:opacity-100">
                    <p>{job.title}</p>
                  </CardContent>
                </Card>
              ))}
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
          <div className="py-4">
            <p className="font-semibold">
              Status:{" "}
              <span className={selectedJob?.status === "Open" ? "text-green-500" : "text-red-500"}>
                {selectedJob?.status}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="job"
              disabled={selectedJob?.status === "Closed"}
              onClick={() => setIsApplyDialogOpen(true)}
            >
              {selectedJob?.status === "Open" ? "Apply Now" : "Position Closed"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>Please fill out the form below to apply for this position.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApply}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div>
                <Label htmlFor="resume">Resume Image</Label>
                <Input id="resume" type="file" accept="image/*" onChange={handleFileChange} required />
                {resumeFile && <p className="text-sm text-muted-foreground mt-2">File selected: {resumeFile.name}</p>}
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="job">
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}