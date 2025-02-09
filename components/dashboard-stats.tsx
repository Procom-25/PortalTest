import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase } from "lucide-react"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
  const [totalApplications, setTotalApplications] = useState('-');
  const [totalJobRoles, setTotalJobRoles] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const { data: session } = useSession();
  const company = session?.user?.name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!company) {
          setIsLoading(false);
          return;
        }

        // Fetch jobs data
        const jobsResponse = await fetch(`/api/jobs?${new URLSearchParams({ company })}`);
        if (!jobsResponse.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const jobsData = await jobsResponse.json();
        setTotalJobRoles(jobsData.result?.length || 0);

        // Fetch applications data
        const applicationsResponse = await fetch(`/api/get-jobs?${new URLSearchParams({ company })}`);
        if (!applicationsResponse.ok) {
          throw new Error('Failed to fetch applications');
        }
        const applicationsData = await applicationsResponse.json();
        setTotalApplications(applicationsData.result?.length.toString() || '0');

        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setTotalApplications('-');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [company]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <StatsCard 
        className="shadow-lg shadow-[#DDDDDD]" 
        title="Total Applications" 
        value={isLoading ? 'Loading...' : totalApplications} 
        icon={FileText} 
      />
      <StatsCard 
        className="shadow-lg shadow-[#DDDDDD]" 
        title="Total Job Roles" 
        value={isLoading ? 'Loading...' : error ? '-' : totalJobRoles.toString()} 
        icon={Briefcase} 
      />
    </div>
  );
}
