"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Target, 
  MessageSquare, 
  FileText,
  Download,
  Copy,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Suggestions } from "./suggestions";

interface AnalysisDetailProps {
  analysis: {
    compatibility: number;
    strengths: string[];
    improvements: string[];
    suggestions: string[];
    interviewQuestions: string[];
    motivationLetter: string;
  };
  onClose: () => void;
}

export function AnalysisDetail({ analysis, onClose }: AnalysisDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Analysis Results</h2>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 gap-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strengths">Strengths</TabsTrigger>
          <TabsTrigger value="improvements">Improvements</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="interview">Interview</TabsTrigger>
          <TabsTrigger value="letter">Motivation Letter</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Profile Compatibility</h3>
              <div className="flex items-center gap-4">
                <Progress value={analysis.compatibility} className="flex-1" />
                <span className="text-2xl font-bold">{analysis.compatibility}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Top Strengths
                  </h4>
                  <ul className="space-y-2">
                    {analysis.strengths.slice(0, 3).map((strength, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {analysis.improvements.slice(0, 3).map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-500 mt-1" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>

            <Card className="p-4">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Key Suggestions
              </h4>
              <ul className="space-y-2">
                {analysis.suggestions.slice(0, 2).map((suggestion, i) => (
                  <li key={i} className="text-sm text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="strengths">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Strengths</h3>
            <ul className="space-y-3">
              {analysis.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="improvements">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Areas for Improvement</h3>
            <ul className="space-y-3">
              {analysis.improvements.map((improvement, i) => (
                <li key={i} className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-500 mt-1" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <Suggestions 
            suggestions={analysis.suggestions}
            compatibility={analysis.compatibility}
          />
        </TabsContent>

        <TabsContent value="interview">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Interview Questions</h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy(analysis.interviewQuestions.join("\n\n"), "Interview questions")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All
              </Button>
            </div>
            <ul className="space-y-4">
              {analysis.interviewQuestions.map((question, i) => (
                <li key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <MessageSquare className="w-5 h-5 mt-1" />
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="letter">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Motivation Letter</h3>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(analysis.motivationLetter, "Motivation letter")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <Card className="p-4">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{analysis.motivationLetter}</div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}