import { AlertCircle } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

interface AlertProps {
    message: string
    }

export function AlertDestructive({ message }: AlertProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {message}
      </AlertDescription>
    </Alert>
  )
}
