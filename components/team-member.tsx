"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export function TeamMember({ name, role, image, bio }: TeamMemberProps) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <Avatar className="w-24 h-24 mb-4">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{role}</p>
      <p className="text-muted-foreground">{bio}</p>
    </Card>
  );
}