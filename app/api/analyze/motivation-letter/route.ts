import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MOTIVATION_LETTER_PROMPT = `Como um especialista em RH com mais de 30 anos de experiência, analise a carta de motivação fornecida em relação à descrição da vaga e forneça uma análise detalhada no seguinte formato JSON:

{
  "score": number, // Pontuação geral de 0 a 100
  "feedback": {
    "strengths": string[], // Pontos fortes da carta
    "improvements": string[] // Áreas que precisam de melhoria
  },
  "suggestions": string[], // Sugestões específicas para melhorar
  "improvedVersion": string // Versão melhorada da carta
}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobDescription, letterContent } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: MOTIVATION_LETTER_PROMPT },
        { role: "user", content: `Descrição da Vaga:\n${jobDescription}\n\nCarta de Motivação:\n${letterContent}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing motivation letter:", error);
    return NextResponse.json(
      { error: "Error analyzing motivation letter" },
      { status: 500 }
    );
  }
}