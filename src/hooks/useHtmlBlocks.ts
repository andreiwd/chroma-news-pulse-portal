
import { useState, useEffect } from "react";
import { useSupabaseConfig } from "./useSupabaseConfig";

interface HtmlBlock {
  id: string;
  name: string;
  position: string;
  content: string;
  active: boolean;
}

export function useHtmlBlocks() {
  const { getConfig } = useSupabaseConfig();
  const [blocks, setBlocks] = useState<HtmlBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const config = await getConfig('html_blocks');
        if (config && Array.isArray(config)) {
          // Safely convert Json array to HtmlBlock array
          const htmlBlocks = (config as unknown as HtmlBlock[]).filter(block => 
            block && 
            typeof block.id === 'string' &&
            typeof block.name === 'string' &&
            typeof block.position === 'string' &&
            typeof block.content === 'string' &&
            typeof block.active === 'boolean'
          );
          setBlocks(htmlBlocks);
        }
      } catch (error) {
        console.error("Error loading HTML blocks:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [getConfig]);

  const getBlocksByPosition = (position: string) => {
    return blocks.filter(block => block.active && block.position === position);
  };

  return { blocks, loading, getBlocksByPosition };
}
