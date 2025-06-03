
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        if (weatherConfig) {
          const typedConfig = weatherConfig as unknown as WeatherConfig;
          setConfigState({
            apiKey: typedConfig.apiKey || '',
            city: typedConfig.city || '',
            enabled: typedConfig.enabled !== false
          });
        }
      } catch (error) {
        console.error("Error loading weather config:", error);
      }
    };

    loadConfig();
  }, [getConfig]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfigState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await setConfig('weather_config', config);
    
    if (success) {
      toast({
        title: "Configuração salva",
        description: "As configurações do clima foram salvas com sucesso.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Clima</h1>
        <p className="text-muted-foreground">
          Configure as informações do widget de clima
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Chave da API OpenWeatherMap</Label>
              <Input
                id="apiKey"
                name="apiKey"
                type="text"
                value={config.apiKey}
                onChange={handleInputChange}
                placeholder="Digite sua chave da API"
              />
              <p className="text-sm text-muted-foreground">
                Obtenha sua chave gratuita em{" "}
                <a 
                  href="https://openweathermap.org/api" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  OpenWeatherMap
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={config.city}
                onChange={handleInputChange}
                placeholder="Ex: São Paulo, BR"
              />
              <p className="text-sm text-muted-foreground">
                Use o formato: Cidade, Código do País (ex: São Paulo, BR)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="enabled"
                name="enabled"
                type="checkbox"
                checked={config.enabled}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="enabled">Habilitar widget de clima</Label>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
