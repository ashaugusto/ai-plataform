"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  Target, 
  TrendingUp, 
  Award,
  Copy,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SuggestionsProps {
  suggestions: string[];
  compatibility: number;
  strengths: string[];
}

export function Suggestions({ suggestions, compatibility, strengths }: SuggestionsProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Sugestão copiada para a área de transferência",
    });
  };

  const getSuggestionIcon = (index: number) => {
    const icons = [Lightbulb, Target, TrendingUp, Award];
    const Icon = icons[index % icons.length];
    return <Icon className="w-5 h-5 text-primary" />;
  };

  const getCompatibilityColor = () => {
    if (compatibility >= 80) return "text-green-500";
    if (compatibility >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Sugestões de Melhoria</h3>
        <Badge variant="outline" className={getCompatibilityColor()}>
          {compatibility}% Compatibilidade
        </Badge>
      </div>

      <div className="grid gap-4">
        {suggestions.map((suggestion, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <div className="mt-1">{getSuggestionIcon(index)}</div>
              <div className="flex-1">
                <p className="text-sm">{suggestion}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(suggestion)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h4 className="font-medium mb-4">Pontos Fortes Atuais</h4>
        <div className="space-y-2">
          {strengths.map((strength, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
              <span className="text-sm">{strength}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 bg-muted">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-5 h-5 text-primary mt-1" />
          <div>
            <h4 className="font-medium mb-2">Dica Profissional</h4>
            <p className="text-sm text-muted-foreground">
              Implemente estas sugestões para melhorar significativamente a compatibilidade 
              do seu perfil com os requisitos da vaga. Foque em conquistas quantificáveis 
              e habilidades específicas mencionadas na descrição do trabalho.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}