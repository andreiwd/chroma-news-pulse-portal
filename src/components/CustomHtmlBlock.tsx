
import { cn } from "@/lib/utils";

type CustomHtmlBlockProps = {
  id: string;
  title?: string;
  html?: string;
  className?: string;
};

export default function CustomHtmlBlock({
  id,
  title,
  html,
  className
}: CustomHtmlBlockProps) {
  // If no HTML content is provided, return a placeholder
  if (!html) {
    return (
      <div
        id={id}
        className={cn(
          "custom-html-block rounded-lg p-4 border border-dashed border-muted-foreground/20",
          className
        )}
      >
        <div className="text-center">
          <p className="font-medium">{title || "Bloco Personalizado"}</p>
          <p className="text-sm text-muted-foreground">
            Conteúdo personalizado será exibido aqui
          </p>
        </div>
      </div>
    );
  }

  // If HTML content is provided, render it
  return (
    <div
      id={id}
      className={cn("custom-html-block rounded-lg overflow-hidden", className)}
    >
      {title && (
        <h3 className="font-bold text-lg border-b p-3">{title}</h3>
      )}
      <div
        className="custom-html-content p-3"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
