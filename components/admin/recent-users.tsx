"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function RecentUsers() {
  const users: User[] = []; // Será preenchido com dados reais da API

  return (
    <div className="space-y-4">
      {users.length === 0 ? (
        <p className="text-center text-muted-foreground">No recent users</p>
      ) : (
        users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
              </p>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}