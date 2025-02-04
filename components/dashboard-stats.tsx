import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase } from "lucide-react"
import React, { useState, useEffect } from 'react';


interface StatsCardProps {
  title: string
  value: string
  icon: React.ElementType
  className?: string
}

function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tabular-nums">{value}</div>
      </CardContent>
    </Card>
  )
}


export function DashboardStats() {
  const [totalApplications, setTotalApplications] = useState('-'); // Initial state, can be any default value
  const [totalJobRoles, setTotalJobRoles] = useState(0); // Initialize with 0, assuming we're fetching the actual count
  const [isLoading, setIsLoading] = useState(true); // State to manage loading indicator
  const [error, setError] = useState(null); // State to manage error

  useEffect(() => {
    const fetchJobsData = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log(data)

        // Assuming the API returns an object with totalCount

        setTotalJobRoles(data['result'].length);

        // If the API returns an array of jobs
        setIsLoading(false);
      } catch (error) {
        console.log(error)
        setTotalApplications('-')
        setIsLoading(false);
      }
    };

    fetchJobsData();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <StatsCard className="shadow-lg shadow-[#DDDDDD]" title="Total Applications" value={totalApplications} icon={FileText} />
      <StatsCard className="shadow-lg shadow-[#DDDDDD]" title="Total Job Roles" value={
        isLoading ? 'Loading...' :
          error ? '-' :
            totalJobRoles.toString()
      } icon={Briefcase} />
    </div>
  );
}
