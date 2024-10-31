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
  Download,
  Copy,
  Lightbulb,
  TrendingUp,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface ProfileAnalysisDetailProps {
  analysis: ProfileAnalysis;
  onClose: () => void;
}

export function LinkedinProfileAnalysisDetail({ analysis, onClose }: ProfileAnalysisDetailProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const downloadReport = () => {
    const report = `
LinkedIn Profile Analysis Report

Overall Score: ${analysis.score}%

Strengths:
${analysis.strengths.map(s => `- ${s}`).join('\n')}

Areas for Improvement:
${analysis.weaknesses.map(w => `- ${w}`).join('\n')}

Recommendations:
${analysis.recommendations.map(r => `- ${r}`).join('\n')}

Industry Fit:
${analysis.industryFit.map(f => `- ${f}`).join('\n')}

Skills Gap Analysis:
${analysis.skillsGap.map(s => `- ${s}`).join('\n')}

Career Path:
Current Position: ${analysis.careerPath.current}

Potential Paths:
${analysis.careerPath.potential.map(p => `- ${p}`).join('\n')}

Next Steps:
${analysis.careerPath.nextSteps.map(s => `- ${s}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'linkedin-profile-analysis.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Profile Analysis</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="industry">Industry Fit</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="career">Career Path</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Profile Score</h3>
              <div className="flex items-center gap-4">
                <Progress value={analysis.score} className="flex-1" />
                <span className="text-2xl font-bold">{analysis.score}%</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h4 className="font-medium mb-4">Strengths</h4>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-4">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-1" />
                      <span>{weakness}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Key Recommendations</h4>
              <ul className="space-y-3">
                {analysis.recommendations.map((recommendation, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-primary mt-1" />
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="industry">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Industry Fit Analysis</h3>
              <div className="space-y-4">
                {analysis.industryFit.map((fit, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p>{fit}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Skills Gap Analysis</h3>
              <div className="space-y-4">
                {analysis.skillsGap.map((skill, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p>{skill}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="career">
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Current Position</h4>
              <p className="text-lg">{analysis.careerPath.current}</p>
            </Card>

            <div>
              <h4 className="font-medium mb-4">Potential Career Paths</h4>
              <div className="space-y-3">
                {analysis.careerPath.potential.map((path, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-primary mt-1" />
                      <p>{path}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-4">Recommended Next Steps</h4>
              <div className="space-y-3">
                {analysis.careerPath.nextSteps.map((step, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-primary mt-1" />
                      <p>{step}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}