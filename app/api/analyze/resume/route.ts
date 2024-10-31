import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const RESUME_ANALYSIS_PROMPT = `Como um especialista em RH com mais de 30 anos de experiência, analise o currículo fornecido e forneça uma análise detalhada no seguinte formato JSON:

{
  "score": number, // Pontuação geral de 0 a 100
  "strengths": string[], // Pontos fortes do currículo
  "weaknesses": string[], // Áreas que precisam de melhoria
  "recommendations": string[], // Recomendações específicas para melhorar
  "keywords": string[], // Palavras-chave importantes encontradas
  "formattingIssues": string[] // Problemas de formatação identificados
}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { resumeText } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: RESUME_ANALYSIS_PROMPT },
        { role: "user", content: resumeText }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Error analyzing resume" },
      { status: 500 }
    );
  }
}