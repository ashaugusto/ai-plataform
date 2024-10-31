"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LinkedinJobCompatibility } from "./linkedin-job-compatibility";
import { LinkedinProfileAnalysis } from "./linkedin-profile-analysis";
import { ResumeAnalysis } from "./resume-analysis";
import { MotivationLetter } from "./motivation-letter";
import { InterviewAnalysis } from "./interview-analysis";
import { AnalysisHistory } from "./analysis-history";

export function LinkedinAnalyzer() {
  const [activeTab, setActiveTab] = useState("job");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Career Analysis Tools</h2>
        <p className="text-muted-foreground">
          Comprehensive tools to analyze and improve your career prospects
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <TabsTrigger value="job">Job Match</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="letter">Cover Letter</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="job">
          <Card className="p-6">
            <LinkedinJobCompatibility />
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="p-6">
            <LinkedinProfileAnalysis />
          </Card>
        </TabsContent>

        <TabsContent value="resume">
          <Card className="p-6">
            <ResumeAnalysis />
          </Card>
        </TabsContent>

        <TabsContent value="letter">
          <Card className="p-6">
            <MotivationLetter />
          </Card>
        </TabsContent>

        <TabsContent value="interview">
          <Card className="p-6">
            <InterviewAnalysis />
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="p-6">
            <AnalysisHistory />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}