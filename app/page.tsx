"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Briefcase, LineChart, MessageSquare, Shield, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "Specialized Chatbots",
    description: "Pre-trained AI assistants for specific business needs"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and GDPR compliance"
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Analytics Dashboard",
    description: "Track performance and usage metrics"
  }
];

const chatbots = [
  {
    title: "HR Assistant",
    icon: <Users className="w-12 h-12 mb-4 text-primary" />,
    description: "Resume screening and candidate evaluation",
    price: "49",
    features: ["Job compatibility analysis", "Interview preparation", "Skill assessment"]
  },
  {
    title: "Financial Advisor",
    icon: <LineChart className="w-12 h-12 mb-4 text-primary" />,
    description: "Personal finance and investment guidance",
    price: "79",
    features: ["Investment strategies", "Risk assessment", "Portfolio analysis"],
    popular: true
  },
  {
    title: "Business Consultant",
    icon: <Briefcase className="w-12 h-12 mb-4 text-primary" />,
    description: "Strategic planning and market analysis",
    price: "99",
    features: ["Market research", "Competitive analysis", "Growth strategies"]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            Launching Soon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            AI-Powered Chatbots for Your Business
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Transform your business with specialized AI assistants. Pre-trained, secure, and ready to deploy.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 text-primary">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Chatbots Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Available Chatbots</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {chatbots.map((bot, index) => (
            <Card key={index} className={`p-8 relative ${bot.popular ? 'border-primary' : ''}`}>
              {bot.popular && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  Popular
                </Badge>
              )}
              <div className="text-center">
                {bot.icon}
                <h3 className="text-2xl font-semibold mb-2">{bot.title}</h3>
                <p className="text-muted-foreground mb-4">{bot.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${bot.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {bot.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/subscribe/${bot.title.toLowerCase().replace(" ", "-")}`}>
                    Subscribe Now
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}