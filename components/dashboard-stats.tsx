import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Briefcase } from "lucide-react"
import type React from "react" // Import React

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <StatsCard className="shadow-lg shadow-[rgba(25,157,223,0.5)]" title="Total Applications" value="45,231" icon={FileText} />
      <StatsCard className="shadow-lg shadow-[rgba(25,157,223,0.5)]" title="Total Job Roles" value="2,350" icon={Briefcase} />
    </div>
  )
}

