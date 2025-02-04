import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/gradient-button"
import { useSession } from 'next-auth/react'
import { Job } from "@/lib/models/Job"

interface AddJobFormProps {
  onSubmit: (job: Job) => void
  onClose: () => void
}

export function AddJobForm({ onSubmit, onClose }: AddJobFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const company = useSession().data?.user?.name;


  const handleSubmit = (e: React.FormEvent) => {

    // So that I dont have to type everytime

    e.preventDefault()

    if (company) { // If company is null for some reason
      const newJob: Job = {
        title,
        company,
        description,
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
          required
        />
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

