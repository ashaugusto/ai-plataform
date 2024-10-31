"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Copy, 
  Download,
  Brain,
  Target,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InterviewAnalysis {
  questions: string[];
  tips: string[];
  keyPoints: string[];
  behavioralQuestions: string[];
  technicalQuestions: string[];
  answers: {
    strengths: string;
    weaknesses: string;
    experience: string;
    motivation: string;
  };
}

interface InterviewAnalysisDetailProps {
  analysis: InterviewAnalysis;
  onClose: () => void;
}

export function InterviewAnalysisDetail({ analysis, onClose }: InterviewAnalysisDetailProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`,
    });
  };

  const downloadPreparation = () => {
    const content = `
Guia de Preparação para Entrevista

Perguntas Gerais:
${analysis.questions.map(q => `- ${q}`).join('\n')}

Perguntas Comportamentais:
${analysis.behavioralQuestions.map(q => `- ${q}`).join('\n')}

Perguntas Técnicas:
${analysis.technicalQuestions.map(q => `- ${q}`).join('\n')}

Pontos-Chave para Destacar:
${analysis.keyPoints.map(p => `- ${p}`).join('\n')}

Dicas de Preparação:
${analysis.tips.map(t => `- ${t}`).join('\n')}

Sugestões de Respostas:
1. Pontos Fortes:
${analysis.answers.strengths}

2. Pontos a Melhorar:
${analysis.answers.weaknesses}

3. Experiência:
${analysis.answers.experience}

4. Motivação:
${analysis.answers.motivation}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'preparacao-entrevista.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Preparação para Entrevista</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={downloadPreparation}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Guia
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions">
        <TabsList className="grid grid-cols-4 gap-4 mb-6">
          <TabsTrigger value="questions">Perguntas</TabsTrigger>
          <TabsTrigger value="behavioral">Comportamental</TabsTrigger>
          <TabsTrigger value="technical">Técnico</TabsTrigger>
          <TabsTrigger value="answers">Respostas</TabsTrigger>
        </TabsList>

        <TabsContent value="questions">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Perguntas Comuns</h3>
              <div className="space-y-4">
                {analysis.questions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-primary mt-1" />
                      <p>{question}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-muted">
              <div className="flex items-start gap-4">
                <Target className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium mb-2">Pontos-Chave</h4>
                  <ul className="space-y-2">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavioral">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Perguntas Comportamentais</h3>
              <div className="space-y-4">
                {analysis.behavioralQuestions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-primary mt-1" />
                      <div>
                        <p className="mb-2">{question}</p>
                        <p className="text-sm text-muted-foreground">
                          Use o método STAR: Situação, Tarefa, Ação, Resultado
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="p-4 bg-muted">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h4 className="font-medium mb-2">Dicas de Preparação</h4>
                  <ul className="space-y-2">
                    {analysis.tips.map((tip, index) => (
                      <li key={index} className="text-sm">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="technical">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Perguntas Técnicas</h3>
              <div className="space-y-4">
                {analysis.technicalQuestions.map((question, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-primary mt-1" />
                      <p>{question}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="answers">
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Pontos Fortes</h4>
              <p className="text-sm whitespace-pre-wrap">{analysis.answers.strengths}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(analysis.answers.strengths, "Pontos fortes")}
                className="mt-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Pontos a Melhorar</h4>
              <p className="text-sm whitespace-pre-wrap">{analysis.answers.weaknesses}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(analysis.answers.weaknesses, "Pontos a melhorar")}
                className="mt-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Experiência</h4>
              <p className="text-sm whitespace-pre-wrap">{analysis.answers.experience}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(analysis.answers.experience, "Experiência")}
                className="mt-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Motivação</h4>
              <p className="text-sm whitespace-pre-wrap">{analysis.answers.motivation}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(analysis.answers.motivation, "Motivação")}
                className="mt-2"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}