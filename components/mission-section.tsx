interface MissionSectionProps {
  title: string;
  content: string;
}

export function MissionSection({ title, content }: MissionSectionProps) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <p className="text-lg text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}