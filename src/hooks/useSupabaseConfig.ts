
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface SiteConfig {
  key: string;
  value: any;
}

export function useSupabaseConfig() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getConfig = async (key: string) => {
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', key)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data?.value || null;
    } catch (error) {
      console.error('Error fetching config:', error);
      return null;
    }
  };

  const setConfig = async (key: string, value: any) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_config')
        .upsert({ key, value }, { onConflict: 'key' });

      if (error) throw error;

      toast({
        title: "Configuração salva",
        description: "As alterações foram salvas com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { getConfig, setConfig, loading };
}
