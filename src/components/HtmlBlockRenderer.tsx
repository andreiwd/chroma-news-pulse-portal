
import { useHtmlBlocks } from "@/hooks/useHtmlBlocks";
import CustomHtmlBlock from "./CustomHtmlBlock";

interface HtmlBlockRendererProps {
  position: string;
  className?: string;
}

export default function HtmlBlockRenderer({ position, className }: HtmlBlockRendererProps) {
  const { getBlocksByPosition, loading } = useHtmlBlocks();
  
  if (loading) return null;
  
  const blocks = getBlocksByPosition(position);
  
  if (blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block) => (
        <CustomHtmlBlock
          key={block.id}
          id={`html-block-${block.id}`}
          title={block.name}
          html={block.content}
          className="mb-4"
        />
      ))}
    </div>
  );
}
