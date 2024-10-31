"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnalysisDetail } from "./analysis-detail";

interface JobAnalysis {
  compatibility: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  interviewQuestions: string[];
  motivationLetter: string;
}

export function LinkedinJobCompatibility() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!linkedinUrl || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both LinkedIn URL and job description",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl, jobDescription }),
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error analyzing:", error);
      toast({
        title: "Error",
        description: "Failed to analyze profile and job compatibility",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!analysis ? (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-2">Job Compatibility Analysis</h2>
            <p className="text-muted-foreground">
              Analyze how well your LinkedIn profile matches the job requirements
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                LinkedIn Profile URL
              </label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/your-profile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !linkedinUrl || !jobDescription}
              className="w-full"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? "Analyzing..." : "Analyze Compatibility"}
            </Button>
          </Card>
        </>
      ) : (
        <AnalysisDetail 
          analysis={analysis} 
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  );
}