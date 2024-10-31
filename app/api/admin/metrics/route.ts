import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Calcular métricas
    const totalUsers = await prisma.user.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" }
    });

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthlyRevenue = await prisma.subscription.aggregate({
      where: {
        status: "ACTIVE",
        startDate: { gte: monthStart }
      },
      _sum: { price: true }
    });

    const analysisCount = await prisma.jobAnalysis.count();

    // Calcular taxa de conversão
    const totalTrialUsers = await prisma.user.count({
      where: { subscriptions: { none: {} } }
    });
    const paidUsers = await prisma.user.count({
      where: { subscriptions: { some: { status: "ACTIVE" } } }
    });
    const conversionRate = totalTrialUsers > 0 
      ? Math.round((paidUsers / totalTrialUsers) * 100)
      : 0;

    // Dados de uso dos últimos 7 dias
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const usageData = await Promise.all(
      last7Days.map(async (date) => {
        const dayStart = new Date(date);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const analyses = await prisma.jobAnalysis.count({
          where: {
            createdAt: {
              gte: dayStart,
              lte: dayEnd
            }
          }
        });

        const activeUsers = await prisma.user.count({
          where: {
            lastLoginAt: {
              gte: dayStart,
              lte: dayEnd
            }
          }
        });

        return {
          date,
          analyses,
          activeUsers
        };
      })
    );

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeSubscriptions,
        monthlyRevenue: monthlyRevenue._sum.price || 0,
        averageSessionTime: 15, // Placeholder - implementar tracking real
        conversionRate,
        analysisCount
      },
      usageData
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Error fetching metrics" },
      { status: 500 }
    );
  }
}
