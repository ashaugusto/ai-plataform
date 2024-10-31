"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Analysis {
  id: string;
  type: string;
  result: any;
  createdAt: string;
}

export function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch("/api/analyses");
        if (!response.ok) throw new Error("Failed to fetch analyses");
        const data = await response.json();
        setAnalyses(data);
      } catch (error) {
        console.error("Error fetching analyses:", error);
        toast({
          title: "Error",
          description: "Failed to fetch analysis history",
          variant: "destructive",
        });
      }
    };

    fetchAnalyses();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analysis History</h2>
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <Card key={analysis.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{analysis.type}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(analysis.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}