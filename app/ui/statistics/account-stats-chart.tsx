"use client";

import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { AccountStats } from "@/app/lib/data/stats-data";
import { Users } from "lucide-react";
import { fetchAccountStats } from "@/app/lib/data/stats-data";
// import { useAuth } from "@/app/lib/auth/auth-context";

const chartConfig = {
  accounts: {
    label: "Accounts",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-4))",
  },
  teachers: {
    label: "Teachers",
    color: "hsl(var(--chart-5))",
  },
  admins: {
    label: "Admins",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function AccountStatsChart() {
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  // const { isAdmin } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetchAccountStats();
        setStats(response);
      } catch (error) {
        console.error("Error fetching account stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      // isAdmin && (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Account Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
      // )
    );
  }

  if (!stats) {
    return (
      // isAdmin && (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Account Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No data available</p>
          </div>
        </CardContent>
      </Card>
      // )
    );
  }

  const chartData = [
    {
      role: "students",
      count: stats.totalStudents,
      fill: "hsl(var(--chart-5))",
    },
    {
      role: "teachers",
      count: stats.totalTeachers,
      fill: "hsl(var(--chart-4))",
    },
    {
      role: "admins",
      count: stats.totalAdmins,
      fill: "hsl(var(--chart-1))",
    },
  ];

  const lastUpdatedDate = new Date(stats.lastUpdated).toLocaleDateString(
    "vi-VN",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    // isAdmin && (
    <Card className="flex flex-col border-none">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Account Statistics
        </CardTitle>
        <CardDescription>Last updated: {lastUpdatedDate}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left side - Statistics */}
          <div className="flex flex-col justify-center space-y-3">
            {[
              { label: "Total Accounts", value: stats.totalAccounts },
              { label: "Admin", value: stats.totalAdmins },
              { label: "Teacher", value: stats.totalTeachers },
              { label: "Student", value: stats.totalStudents },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className={"text-xl font-semibold"}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Right side - Pie Chart */}
          <div className="flex items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="aspect-square max-h-[250px] w-full"
            >
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="role" />
                <ChartLegend
                  content={<ChartLegendContent nameKey="role" />}
                  className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
    // )
  );
}
