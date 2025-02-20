"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { LoginSkeleton } from "@/components/login-skeleton"
import Footer from "@/components/footer"


export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoginSkeleton />
  }
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex items-center h-screen justify-center">
        <div className="flex flex-col items-center gap-4 p-6 md:p-8 mt-[-50px]">
          {/* <div className="font-bold bg-clip-text text-transparent bg-[linear-gradient(180deg,_#199DDF_0%,_#145BD5_100%)] text-4xl sm:text-6xl">
            Procom<span>&#39;</span>25
          </div> */}
          <div className="font-bold sm:text-3xl">
            Company Portal
          </div>
          <div className="w-full max-w-xs mt-2 text-left">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block m-4 rounded-xl">
        <Image
          src="/5656.jpg" 
          alt="Image"
          fill 
          className="object-cover contrast-[0.8] dark:brightness-[0.5] dark:grayscale rounded-xl"
        />
      </div>
    </div>
  );
}