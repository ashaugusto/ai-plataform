import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const HR_PROMPT = `Você é um Diretor de Recursos Humanos com formação especializada e mais de 30 anos de experiência...`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkedinUrl, jobDescription } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: HR_PROMPT },
        { role: "user", content: `Analise o seguinte:\n\nPerfil LinkedIn: ${linkedinUrl}\n\nDescrição da Vaga: ${jobDescription}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    await prisma.jobAnalysis.create({
      data: {
        userId: session.user.id,
        linkedinUrl,
        jobDescription,
        analysis,
        compatibility: analysis.compatibility,
      }
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in analysis:", error);
    return NextResponse.json(
      { error: "Error processing analysis" },
      { status: 500 }
    );
  }
}