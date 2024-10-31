"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CommunityLink {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
}

export function Community() {
  const [links, setLinks] = useState<CommunityLink[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const response = await fetch("/api/community/links");
        if (!response.ok) throw new Error("Failed to fetch community links");
        const data = await response.json();
        setLinks(data);
      } catch (error) {
        console.error("Error fetching community links:", error);
        toast({
          title: "Error",
          description: "Failed to fetch community links",
          variant: "destructive",
        });
      }
    };

    fetchLinks();
  }, [toast]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Community</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {links.map((link) => (
          <Card key={link.id} className="p-4">
            <h3 className="font-semibold">{link.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Join Community
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}