"use client";

import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { MissionSection } from "@/components/mission-section";
import { TeamMember } from "@/components/team-member";

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Former AI research lead with 15+ years in machine learning and natural language processing."
  },
  {
    name: "David Rodriguez",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Pioneered several breakthrough algorithms in conversational AI and neural networks."
  },
  {
    name: "Emily Watson",
    role: "Head of Product",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&h=256&q=80",
    bio: "Product strategist focused on creating intuitive AI solutions for enterprise clients."
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-24">
        <SectionHeader 
          title="About ChatBot Enterprise"
          description="Transforming businesses through intelligent conversation"
        />

        <MissionSection 
          title="Our Mission"
          content="We are on a mission to democratize access to advanced AI technology. By providing pre-trained, specialized chatbots, we enable businesses of all sizes to leverage the power of artificial intelligence without the complexity of building and training their own solutions."
        />

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                bio={member.bio}
              />
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-muted-foreground">Pushing the boundaries of what is possible with AI technology.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-muted-foreground">Making advanced AI solutions available to businesses of all sizes.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Security</h3>
              <p className="text-muted-foreground">Ensuring the highest standards of data protection and privacy.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-muted-foreground">Delivering exceptional quality in every interaction and solution.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}