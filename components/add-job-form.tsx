import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GradientButton } from "@/components/gradient-button"
import { useSession } from 'next-auth/react'
import { Job } from "@/lib/models/Job"

interface AddJobFormProps {
  onSubmit: (job: Job) => void
  onClose: () => void
}

export function AddJobForm({ onSubmit, onClose }: AddJobFormProps) {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<"open" | "closed">("open")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState(Date.now())
  const company = useSession().data?.user?.name;


  const handleSubmit = (e: React.FormEvent) => {

    // So that I dont have to type everytime
    setTitle("newTitle")
    setDeadline(Date.now())
    setDescription("JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB JOB ")


    e.preventDefault()

    if (company) { // If company is null for some reason
      const newJob: Job = {
        title,
        company,
        deadline,
        description,
        status,
      }

      onSubmit(newJob)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter job title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter job description"
        />
      </div>
      {/* TODO Impliment date picker */}
      <div className="space-y-2">
        <Label htmlFor="deadline">Application Deadline</Label>
        <Input
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(1234)}
          placeholder="Enter application deadline"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: "open" | "closed") => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select job status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <GradientButton
        gradientFrom="from-[#199DDF]"
        gradientTo="to-[#145BD5]"
        hoverGradientFrom="from-[#199DDF]"
        hoverGradientTo="to-[#145BD5]"
      >
        Add Job
      </GradientButton>
    </form>
  )
}

