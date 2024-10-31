import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const links = await prisma.communityLink.findMany({
      where: {
        active: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(links);
  } catch (error) {
    console.error("Error fetching community links:", error);
    return NextResponse.json(
      { error: "Error fetching community links" },
      { status: 500 }
    );
  }
}