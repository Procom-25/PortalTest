import type React from "react"
import { Separator } from "@/components/ui/separator"

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <div className="h-8 w-8 rounded-md bg-gray-300"></div>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3">
          <div className="h-8 w-24 bg-gray-300 rounded"></div>
        </div>
      </header>

      {/* Content Skeleton */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="col-span-4">
            {/* Welcome message skeleton */}
            <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>

            {/* DashboardStats skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-20 bg-gray-300 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                  </div>
                  <div className="h-8 w-16 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>

            {/* JobList skeleton */}
            <div className="mt-8">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                  <div className="h-6 w-32 bg-gray-300 rounded mb-4"></div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-300"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-24 bg-gray-300 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSkeleton

