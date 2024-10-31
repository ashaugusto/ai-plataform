"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  progress: {
    percentage: number;
    completed: boolean;
  }[];
}

export function Tutorials() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch("/api/tutorials");
        if (!response.ok) throw new Error("Failed to fetch tutorials");
        const data = await response.json();
        setTutorials(data);
      } catch (error) {
        console.error("Error fetching tutorials:", error);
        toast({
          title: "Error",
          description: "Failed to fetch tutorials",
          variant: "destructive",
        });
      }
    };

    fetchTutorials();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tutorials</h2>
      <div className="space-y-4">
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} className="p-4">
            <h3 className="font-semibold mb-2">{tutorial.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {tutorial.description}
            </p>
            <Progress
              value={tutorial.progress[0]?.percentage || 0}
              className="h-2"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}