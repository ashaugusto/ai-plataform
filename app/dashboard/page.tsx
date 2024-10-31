"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkedinAnalyzer } from "@/components/dashboard/linkedin-analyzer";
import { SupportCenter } from "@/components/dashboard/support-center";
import { Community } from "@/components/dashboard/community";
import { Tutorials } from "@/components/dashboard/tutorials";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <Tabs defaultValue="analyzer" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyzer">LinkedIn Analyzer</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
        </TabsList>

        <TabsContent value="analyzer">
          <Card className="p-6">
            <LinkedinAnalyzer />
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-6">
            <SupportCenter />
          </Card>
        </TabsContent>

        <TabsContent value="community">
          <Card className="p-6">
            <Community />
          </Card>
        </TabsContent>

        <TabsContent value="tutorials">
          <Card className="p-6">
            <Tutorials />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}