"use client";

import { SectionHeader } from "@/components/section-header";
import { FeatureCard } from "@/components/feature-card";
import { 
  Bot, 
  Shield, 
  BarChart3, 
  Settings2, 
  Users, 
  Zap,
  MessageSquare,
  Code2,
  Gauge
} from "lucide-react";

const features = [
  {
    title: "Specialized Chatbots",
    description: "Pre-trained AI assistants for HR, finance, and customer service, ready to deploy instantly.",
    icon: Bot
  },
  {
    title: "Enterprise Security",
    description: "Bank-grade encryption, GDPR compliance, and advanced authentication protocols.",
    icon: Shield
  },
  {
    title: "Advanced Analytics",
    description: "Detailed insights into chatbot performance, user engagement, and ROI metrics.",
    icon: BarChart3
  },
  {
    title: "Easy Configuration",
    description: "Intuitive interface for customizing chatbot behavior, responses, and integration settings.",
    icon: Settings2
  },
  {
    title: "Team Collaboration",
    description: "Multi-user access with role-based permissions and shared workspaces.",
    icon: Users
  },
  {
    title: "High Performance",
    description: "Lightning-fast responses with distributed infrastructure and load balancing.",
    icon: Zap
  },
  {
    title: "Natural Conversations",
    description: "Advanced NLP for human-like interactions and context awareness.",
    icon: MessageSquare
  },
  {
    title: "API Integration",
    description: "Seamless integration with your existing systems through RESTful APIs.",
    icon: Code2
  },
  {
    title: "Real-time Monitoring",
    description: "Live dashboard for monitoring chatbot performance and user interactions.",
    icon: Gauge
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-24">
        <SectionHeader 
          title="Powerful Features for Modern Businesses"
          description="Discover how our AI platform can transform your business operations"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}