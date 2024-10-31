import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PROFILE_ANALYSIS_PROMPT = `Como um Diretor de RH experiente, analise o perfil do LinkedIn fornecido e forneça uma análise detalhada no seguinte formato JSON:

{
  "score": number, // Pontuação geral de 0 a 100
  "strengths": string[], // Pontos fortes do perfil
  "weaknesses": string[], // Áreas que precisam de melhoria
  "recommendations": string[], // Recomendações específicas
  "industryFit": string[], // Análise de adequação à indústria
  "skillsGap": string[], // Lacunas de habilidades identificadas
  "careerPath": {
    "current": string, // Posição atual
    "potential": string[], // Possíveis caminhos de carreira
    "nextSteps": string[] // Próximos passos recomendados
  }
}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { linkedinUrl } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: PROFILE_ANALYSIS_PROMPT },
        { role: "user", content: `Perfil LinkedIn: ${linkedinUrl}` }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const analysis = JSON.parse(completion.choices[0].message?.content || "{}");

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing profile:", error);
    return NextResponse.json(
      { error: "Error analyzing profile" },
      { status: 500 }
    );
  }
}