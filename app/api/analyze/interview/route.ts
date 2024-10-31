import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const INTERVIEW_ANALYSIS_PROMPT = `Como um Diretor de RH experiente, analise o perfil do candidato e a descrição da vaga para gerar uma análise detalhada de preparação para entrevista no seguinte formato JSON:

{
  "questions": string[], // Lista de possíveis perguntas da entrevista
  "tips": string[], // Dicas de preparação específicas
  "keyPoints": string[], // Pontos-chave que o candidato deve destacar
  "behavioralQuestions": string[], // Perguntas comportamentais específicas
  "technicalQuestions": string[], // Perguntas técnicas baseadas nos requisitos
  "answers": { // Sugestões de respostas estruturadas
    "strengths": string,
    "weaknesses": string,
    "experience": string,
    "motivation": string
  }
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
        { role: "system", content: INTERVIEW_ANALYSIS_PROMPT },
        { role: "user", content: `Perfil LinkedIn: ${linkedinUrl}\n\nDescrição da Vaga: ${jobDescription}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing interview:", error);
    return NextResponse.json(
      { error: "Error analyzing interview" },
      { status: 500 }
    );
  }
}