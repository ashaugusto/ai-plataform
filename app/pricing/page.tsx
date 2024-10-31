"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { CheckoutButton } from "@/components/subscription/checkout-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Starter",
    price: "49",
    description: "Perfect for small businesses getting started with AI",
    features: [
      "1 Specialized Chatbot",
      "5,000 Messages/month",
      "Basic Analytics",
      "Email Support",
      "API Access"
    ],
    planType: "STARTER"
  },
  {
    name: "Professional",
    price: "149",
    description: "Ideal for growing businesses needing multiple chatbots",
    features: [
      "3 Specialized Chatbots",
      "25,000 Messages/month",
      "Advanced Analytics",
      "Priority Support",
      "API Access",
      "Custom Branding",
      "Team Collaboration"
    ],
    planType: "PROFESSIONAL",
    popular: true
  },
  {
    name: "Enterprise",
    price: "499",
    description: "For large organizations requiring full AI capabilities",
    features: [
      "Unlimited Chatbots",
      "Unlimited Messages",
      "Enterprise Analytics",
      "24/7 Support",
      "API Access",
      "Custom Branding",
      "Team Collaboration",
      "Custom Integration",
      "Dedicated Account Manager"
    ],
    planType: "ENTERPRISE"
  }
];

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubscribe = (planType: string) => {
    if (!session) {
      router.push("/login");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your business needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`p-8 relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <Badge className="absolute top-4 right-4" variant="secondary">
                  Most Popular
                </Badge>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <CheckoutButton 
                  planType={plan.planType}
                  className="w-full"
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}