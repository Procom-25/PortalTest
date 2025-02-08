"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

interface Company {
  id: string
  name: string
}

const companies: Company[] = [
  { id: "1", name: "Company One" },
  { id: "2", name: "Company Two" },
  { id: "3", name: "Company Three" },
  { id: "4", name: "Company Four" },
  { id: "5", name: "Company Five" },
  { id: "6", name: "Company Six" },
  { id: "7", name: "Company Seven" },
  { id: "8", name: "Company Eight" },
  { id: "9", name: "Company Nine" },
  { id: "10", name: "Company Ten" },
  { id: "11", name: "Company Eleven" },
  { id: "12", name: "Company Twelve" },
  { id: "13", name: "Company Thirteen" },
  { id: "14", name: "Company Fourteen" },
  { id: "15", name: "Company Fifteen" },
]

export default function CompanyListings({ params }: { params: { username: string } }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="relative bg-muted w-full lg:w-[40%] h-[300px] lg:h-auto">
        <Image
          src="/comp.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col items-center justify-center p-6">
          <p className="text-xl sm:text-3xl text-white animate-fade-in-up text-center lg:text-center absolute top-3/4 transform translate-y-1/2">
            Your Journey Begins Here!
          </p>
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-8 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-6xl text-center">Companies</h2>
          </div>
          <div className="w-full">
            <ScrollArea className="h-[80vh] w-full">
              <div className="space-y-3 p-4 pr-6">
                {companies.map((company) => (
                  <Card
                    key={company.id}
                    className="rounded-2xl border bg-card text-card-foreground hover:bg-secondary hover:cursor-pointer hover:shadow-md hover:shadow-[rgba(25,157,223,0.5)] transition-all duration-300"
                  >
                    <CardContent className="p-5 text-2xl text-center font-semibold opacity-70 hover:opacity-100">
                      <a href="#">{company.name}</a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

