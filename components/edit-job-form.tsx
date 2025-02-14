import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GradientButton } from "@/components/gradient-button"
import { useSession } from 'next-auth/react'
import { Job } from "@/lib/models/Job"

interface EditJobFormProps {
  onSubmit: (job: Job) => void
  onClose: () => void
  job: Job
}

export function EditJobForm({ onSubmit, onClose, job }: EditJobFormProps) {
  const [description, setDescription] = useState(job.description)
  const company = useSession().data?.user?.name;


  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault()

    if (company) { // If company is null for some reason
      const newJob: Job = {
        title: job.title,
        company: company,
        description,
      }

      onSubmit(newJob)
      onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="!mt-8">
        <GradientButton
          gradientFrom="from-[#000000]"
          gradientTo="to-[#000000]"
          hoverGradientFrom="from-[#000000]"
          hoverGradientTo="to-[#000000]"
        >
          Update Description
        </GradientButton>
      </div>
    </form>
  )
}

