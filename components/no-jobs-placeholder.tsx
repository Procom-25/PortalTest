

export function NoJobsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Added</h3>
      <p className="text-gray-500">
        You haven't added any job listings yet. Click the "Add Job" button to get started.
      </p>
    </div>
  )
}

