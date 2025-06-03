
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface SiteConfig {
  key: string;
  value: any;
}

export function useSupabaseConfig() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getConfig = useCallback(async (key: string) => {
    try {
      console.log(`Buscando configuração: ${key}`);
      const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', key)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar config:', error);
        return null;
      }

      console.log(`Config encontrada para ${key}:`, data?.value);
      return data?.value || null;
    } catch (error) {
      console.error('Erro ao buscar configuração:', error);
      return null;
    }
  }, []);

  const setConfig = useCallback(async (key: string, value: any) => {
    setLoading(true);
    try {
      console.log(`Salvando configuração ${key}:`, value);
      
      const { error } = await supabase
        .from('site_config')
        .upsert({ 
          key, 
          value,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'key' 
        });

      if (error) {
        console.error('Erro ao salvar no Supabase:', error);
        throw error;
      }

      console.log(`Configuração ${key} salva com sucesso`);
      return true;
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração. Tente novamente.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { getConfig, setConfig, loading };
}
