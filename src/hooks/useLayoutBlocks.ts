
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface LayoutBlock {
  id: string;
  type: 'carousel' | 'section';
  category_slug: string;
  order_position: number;
  active: boolean;
}

export function useLayoutBlocks() {
  const [blocks, setBlocks] = useState<LayoutBlock[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('layout_blocks')
        .select('*')
        .eq('active', true)
        .order('order_position');

      if (error) throw error;

      setBlocks(data || []);
    } catch (error) {
      console.error('Error fetching layout blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = async (type: 'carousel' | 'section', categorySlug: string) => {
    try {
      const maxOrder = Math.max(...blocks.map(b => b.order_position), -1);
      const { data, error } = await supabase
        .from('layout_blocks')
        .insert({
          type,
          category_slug: categorySlug,
          order_position: maxOrder + 1,
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      setBlocks(prev => [...prev, data]);
      toast({
        title: "Bloco adicionado",
        description: "Bloco adicionado com sucesso.",
      });

      return data;
    } catch (error) {
      console.error('Error adding block:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar bloco.",
        variant: "destructive",
      });
      return null;
    }
  };

  const removeBlock = async (id: string) => {
    try {
      const { error } = await supabase
        .from('layout_blocks')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBlocks(prev => prev.filter(b => b.id !== id));
      toast({
        title: "Bloco removido",
        description: "Bloco removido com sucesso.",
      });
    } catch (error) {
      console.error('Error removing block:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover bloco.",
        variant: "destructive",
      });
    }
  };

  const moveBlock = async (id: string, direction: 'up' | 'down') => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    if (blockIndex === -1) return;

    const newBlocks = [...blocks];
    const block = newBlocks[blockIndex];
    
    newBlocks.splice(blockIndex, 1);
    const newIndex = direction === 'up' 
      ? Math.max(0, blockIndex - 1) 
      : Math.min(newBlocks.length, blockIndex + 1);
    
    newBlocks.splice(newIndex, 0, block);

    // Update order positions
    const updates = newBlocks.map((block, index) => ({
      id: block.id,
      order_position: index
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('layout_blocks')
          .update({ order_position: update.order_position })
          .eq('id', update.id);

        if (error) throw error;
      }

      setBlocks(newBlocks.map((block, index) => ({
        ...block,
        order_position: index
      })));
    } catch (error) {
      console.error('Error moving block:', error);
      toast({
        title: "Erro",
        description: "Erro ao mover bloco.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  return {
    blocks,
    loading,
    addBlock,
    removeBlock,
    moveBlock,
    refetch: fetchBlocks
  };
}
