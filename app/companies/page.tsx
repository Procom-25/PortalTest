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
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  async function getCompanies() {
    try {
      const response = await fetch(`/api/companies`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseBody = await response.json();
      setCompanies(responseBody["result"]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <div className="min-h-screen max-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-white from-60% to-gray-200 to-90%">
      <div className="relative bg-muted w-full lg:w-[40%] h-[300px] lg:h-auto overscroll-none hidden m-4 rounded-xl lg:block">
        <div className="relative w-full h-full">
          <Image
            src="/231.png"
            alt="Background Image"
            layout="fill"
            objectFit="cover"
            className="dark:brightness-[0.2] dark:grayscale rounded-xl"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50 rounded-xl pointer-events-none"></div>
        </div>
        <div className="absolute inset-0 flex flex-col justify-between p-8">
          <div className="flex items-center gap-2 p-4">
            <div className="w-6 h-10">
              <img
                src="https://www.procom.com.pk/Procom-Logo.png"
                alt="Company Logo"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p className="text-xl sm:text-2xl text-white animate-fade-in-up text-center lg:text-center absolute md:top-[85%] top-[80%] transform translate-y-1/2">
            Your dream job is just an application away!
          </p>
        </div>
      </div>
      <div className="flex-1 p-2 lg:p-2 w-full lg:w-[60%] flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl flex flex-col px-10">
          <div className="mb-8">
            <h2 className="md:text-6xl text-4xl font-bold mb-2">Shape Your Future</h2>
            <p className="ml-1">
              Find and apply to the company that best matches your career aspirations.
            </p>
          </div>
          <ScrollArea className="h-[74vh]   scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div className="space-y-3 p-0">
              {companies ? (
                companies.map((company: Company) => (
                  <Card
                    key={company._id}
                    onMouseEnter={() => setHoveredCardId(company._id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className={`rounded-xl border border-gray-300 bg-white/80 backdrop-blur-md shadow-md 
                      hover:bg-gray-100 hover:shadow-lg
                      transition-all duration-300 ease-in-out
                      px-3 py-2 text-sm font-medium text-gray-800`}
                  >
                    <a href={`/companies/${company.name}`}>
                      <CardContent className="py-5 text-black text-2xl sm:text-2xl font-semibold opacity-70 hover:opacity-100 text-center flex justify-between items-center">
                        <span className="block text-left overflow-hidden overflow-ellipsis text-ellipsis line-clamp-2">{company.name}</span>
                        {hoveredCardId === company._id && (
                          <div className="flex items-center space-x-2 bg-gray-200 rounded-lg px-3 py-1">
                            <span className="text-sm font-medium text-gray-800">Apply Now</span>
                          </div>
                        )}
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