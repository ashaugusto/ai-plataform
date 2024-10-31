"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Copy, 
  Loader2,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MotivationLetterAnalysis {
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
  };
  suggestions: string[];
  improvedVersion: string;
}

export function MotivationLetter() {
  const [jobDescription, setJobDescription] = useState("");
  const [letterContent, setLetterContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MotivationLetterAnalysis | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!jobDescription || !letterContent) {
      toast({
        title: "Missing Information",
        description: "Please provide both job description and letter content",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze/motivation-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, letterContent }),
      });

      if (!response.ok) throw new Error("Failed to analyze letter");

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error("Error analyzing letter:", error);
      toast({
        title: "Error",
        description: "Failed to analyze motivation letter",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const downloadLetter = () => {
    if (!analysis) return;

    const content = analysis.improvedVersion;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "motivation-letter.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {!analysis ? (
        <>
          <div>
            <h2 className="text-2xl font-bold mb-2">Motivation Letter Analysis</h2>
            <p className="text-muted-foreground">
              Get feedback on your motivation letter and suggestions for improvement
            </p>
          </div>

          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="mb-4"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Motivation Letter
              </label>
              <Textarea
                value={letterContent}
                onChange={(e) => setLetterContent(e.target.value)}
                placeholder="Paste your motivation letter here..."
                className="mb-4"
                rows={8}
              />
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !jobDescription || !letterContent}
              className="w-full"
            >
              {isAnalyzing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAnalyzing ? "Analyzing..." : "Analyze Letter"}
            </Button>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setAnalysis(null)}>
                New Analysis
              </Button>
              <Button onClick={downloadLetter}>
                <Download className="w-4 h-4 mr-2" />
                Download Letter
              </Button>
            </div>
          </div>

          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Strengths</h3>
                <ul className="space-y-2">
                  {analysis.feedback.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {analysis.feedback.improvements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-yellow-500 mt-1" />
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Suggestions</h3>
              <div className="space-y-3">
                {analysis.suggestions.map((suggestion, i) => (
                  <Card key={i} className="p-4 bg-muted">
                    <p className="text-sm">{suggestion}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Improved Version</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(analysis.improvedVersion)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Card className="p-4 bg-muted">
                <pre className="whitespace-pre-wrap text-sm">
                  {analysis.improvedVersion}
                </pre>
              </Card>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}