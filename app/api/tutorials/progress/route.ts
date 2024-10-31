import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorialId, percentage, completed } = await req.json();

    const progress = await prisma.progress.upsert({
      where: {
        userId_tutorialId: {
          userId: session.user.id,
          tutorialId
        }
      },
      update: {
        percentage,
        completed
      },
      create: {
        userId: session.user.id,
        tutorialId,
        percentage,
        completed
      }
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Error updating progress" },
      { status: 500 }
    );
  }
}