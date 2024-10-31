import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricsCards } from "@/components/admin/metrics-cards";
import { UsageChart } from "@/components/admin/usage-chart";
import { RecentUsers } from "@/components/admin/recent-users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function getAdminData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/metrics`, {
    cache: "no-store",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch admin data");
  }

  return response.json();
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { metrics, usageData } = await getAdminData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <MetricsCards metrics={metrics} />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <UsageChart data={usageData} />

        <Card className="col-span-4 md:col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentUsers />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}