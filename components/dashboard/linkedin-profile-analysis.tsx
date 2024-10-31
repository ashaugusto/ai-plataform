"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LinkedinProfileAnalysisDetail } from "./linkedin-profile-analysis-detail";

interface ProfileAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  industryFit: string[];
  skillsGap: string[];
  careerPath: {
    current: string;
    potential: string[];
    nextSteps: string[];
  };
}

export function LinkedinProfileAnalysis() {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!linkedinUrl) {
      toast({
        title: "Missing Information",
        description: "Please provide your LinkedIn profile URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze/linkedin-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkedinUrl }),
      });

      if (!response.ok) throw new Error("Failed to analyze profile");

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error analyzing profile:", error);
      toast({
        title: "Error",
        description: "Failed to analyze LinkedIn profile",
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
            <h2 className="text-2xl font-bold mb-2">LinkedIn Profile Analysis</h2>
            <p className="text-muted-foreground">
              Get a comprehensive analysis of your professional profile
            </p>
          </div>

          <Card className="p-6">
            <div className="space-y-4">
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

              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !linkedinUrl}
                className="w-full"
              >
                {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAnalyzing ? "Analyzing..." : "Analyze Profile"}
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <LinkedinProfileAnalysisDetail 
          analysis={analysis} 
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  );
}