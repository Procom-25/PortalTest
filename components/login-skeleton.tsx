import { Skeleton } from "@/components/ui/skeleton"

export function LoginSkeleton() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex items-center h-screen justify-center">
        <div className="flex flex-col items-center text-center gap-4 p-6 md:p-8 mt-[-50px]">
          <Skeleton className="h-12 w-48 bg-gray-200" />
          <Skeleton className="h-10 w-36 bg-gray-200" />
          <div className="w-full max-w-xs mt-8">
            <Skeleton className="h-10 w-full mb-4 bg-gray-200" />
            <Skeleton className="h-10 w-full mb-4 bg-gray-200" />
            <Skeleton className="h-10 w-full mb-4 bg-gray-200" />
            <Skeleton className="h-10 w-full bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  )
}

