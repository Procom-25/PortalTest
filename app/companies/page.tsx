"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Company } from "@/lib/models/Company";
import { useEffect, useState } from "react";
import { LoadingPlaceholder } from "@/components/loading-placeholder";

export default function CompanyListings({
  params,
}: {
  params: { company: string };
}) {
  const [companies, setCompanies] = useState(null);

  async function getCompanies() {
    try {
      const response = await fetch(`/api/companies`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();

      console.log(responseBody["result"]);

      setCompanies(responseBody["result"]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    getCompanies();
  }, []);

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
        <div className="absolute inset-0 bg-black bg-opacity-65 flex flex-col justify-between p-8">
          <div className="flex items-center gap-2 p-4">
            <div className="w-8 h-12 ">
              <img
                src="https://www.procom.com.pk/Procom-Logo.png"
                alt="Company Logo"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p className="text-xl sm:text-3xl text-white animate-fade-in-up text-center lg:text-center absolute top-[80%] transform translate-y-1/2">
            Your Journey Begins Here!
          </p>
        </div>
      </div>
      <div className="flex-1 p-6 lg:p-8 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col px-10">
          <div className="my-4">
            <h2 className="md:text-6xl text-5xl font-bold tracking-tighter text-center">
              Companies
            </h2>
          </div>
          <ScrollArea className="h-[70vh] pr-4">
            <div className="space-y-3 p-4">
              {companies ? (
                companies.map((company: Company) => (
                  <Card
                    key={company.id}
                    className="rounded-xl border bg-card text-card-foreground
                      hover:bg-secondary hover:cursor-pointer hover:shadow-md 
                      hover:shadow-[rgba(25,157,223,0.5)] transition-all duration-300
                      "
                  >
                    <a href={`/companies/${company.name}`}>
                      <CardContent className="py-5 text-3xl sm:text-2xl font-semibold opacity-70 hover:opacity-100 text-center">
                        {company.name}
                      </CardContent>
                    </a>
                  </Card>
                ))
              ) : (
                <LoadingPlaceholder />
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
