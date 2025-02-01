import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GradientButton } from "@/components/gradient-button"

interface Job {
  id: number
  title: string
  status: "Open" | "Closed"
}

interface AddJobFormProps {
  onSubmit: (job: Job) => void
}

export function AddJobForm({ onSubmit }: AddJobFormProps) {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<"Open" | "Closed">("Open")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newJob: Job = {
      id: Math.floor(Math.random() * 10) + 1, 
      title,
      status,
    }
    onSubmit(newJob)
    setTitle("")
    setStatus("Open")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter job title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: "Open" | "Closed") => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select job status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
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

