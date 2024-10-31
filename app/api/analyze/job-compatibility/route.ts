import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JOB_COMPATIBILITY_PROMPT = `Como um Diretor de RH experiente, analise a compatibilidade entre o perfil do candidato e a vaga, fornecendo uma análise detalhada no seguinte formato JSON:

{
  "compatibility": number, // Porcentagem de compatibilidade (0-100)
  "strengths": string[], // Pontos fortes do candidato para a vaga
  "improvements": string[], // Áreas que precisam de melhoria
  "suggestions": string[], // Sugestões específicas
  "interviewQuestions": string[], // Perguntas prováveis na entrevista
  "motivationLetter": string // Sugestão de carta de motivação
}`;

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
        { role: "system", content: JOB_COMPATIBILITY_PROMPT },
        { role: "user", content: `Perfil LinkedIn: ${linkedinUrl}\n\nDescrição da Vaga: ${jobDescription}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing job compatibility:", error);
    return NextResponse.json(
      { error: "Error analyzing job compatibility" },
      { status: 500 }
    );
  }
}