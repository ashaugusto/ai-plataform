"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywords: string[];
  formattingIssues: string[];
}

export function ResumeAnalysis() {
  const [resumeText, setResumeText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText) {
      toast({
        title: "Missing Information",
        description: "Please provide your resume text",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      toast({
        title: "Error",
        description: "Failed to analyze resume",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Resume Analysis</h2>
        <p className="text-muted-foreground">
          Get detailed feedback on your resume
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Resume Text
            </label>
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              rows={10}
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || !resumeText}
            className="w-full"
          >
            {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </div>
      </Card>

      {analysis && (
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Strengths</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {analysis.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Areas for Improvement</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {analysis.weaknesses.map((weakness, i) => (
                      <li key={i}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Key Keywords Found</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {analysis.formattingIssues.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Formatting Issues</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {analysis.formattingIssues.map((issue, i) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}