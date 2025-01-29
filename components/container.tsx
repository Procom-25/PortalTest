
interface JobCardProps {
  JobName: string
}

export function JobContainer({ JobName }: JobCardProps) {

  return (
    <div className="h-14 flex w-11/12 flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center hover:bg-gray-50 hover:shadow-md">
      <p className="font-medium leading-none">
        <span>{JobName}</span>
      </p>
    </div>
  )
}
