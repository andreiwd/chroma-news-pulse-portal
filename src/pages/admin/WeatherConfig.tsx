
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface WeatherConfig {
  apiKey: string;
  city: string;
  enabled: boolean;
}

export default function WeatherConfig() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [config, setConfigState] = useState<WeatherConfig>({
    apiKey: '',
    city: '',
    enabled: true
  });

  // Load config from Supabase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const weatherConfig = await getConfig('weather_config');
        console.log("Carregando config do clima:", weatherConfig);
        if (weatherConfig && typeof weatherConfig === 'object') {
          const configData = weatherConfig as Record<string, any>;
          setConfigState({
            apiKey: configData.apiKey || '',
            city: configData.city || '',
            enabled: configData.enabled !== false
          });
        }
      } catch (error) {
        console.error("Erro ao carregar config do clima:", error);
      }
    };

    loadConfig();
  }, [getConfig]);

  const updateConfig = (field: keyof WeatherConfig, value: string | boolean) => {
    setConfigState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando config do clima:", config);
    
    try {
      const success = await setConfig('weather_config', config);
      
      if (success) {
        toast({
          title: "Configuração salva",
          description: "As configurações do clima foram salvas com sucesso.",
        });
      } else {
        throw new Error("Falha ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar config do clima:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração do clima.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Clima</h1>
        <p className="text-muted-foreground">
          Configure o widget de clima que aparece na lateral do site
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Widget de Clima</CardTitle>
          <CardDescription>
            Configure a API do OpenWeatherMap para exibir informações do clima
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Habilitar widget de clima</Label>
                <p className="text-sm text-muted-foreground">
                  Ativa ou desativa o widget de clima no site
                </p>
              </div>
              <Switch
                id="enabled"
                checked={config.enabled}
                onCheckedChange={(checked) => updateConfig('enabled', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API OpenWeatherMap</Label>
              <Input
                id="apiKey"
                type="text"
                value={config.apiKey}
                onChange={(e) => updateConfig('apiKey', e.target.value)}
                placeholder="Digite sua chave da API"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Obtenha sua chave gratuita em{" "}
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline text-primary hover:text-primary/80"
                >
                  OpenWeatherMap
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                type="text"
                value={config.city}
                onChange={(e) => updateConfig('city', e.target.value)}
                placeholder="Ex: São Paulo, BR"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Use o formato: Cidade, Código do País (ex: São Paulo, BR)
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
