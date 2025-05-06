
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import WeatherWidget from "@/components/WeatherWidget";

export default function WeatherConfig() {
  const { toast } = useToast();
  const [city, setCity] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('weatherConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setCity(config.city || "");
      setApiKey(config.apiKey || "");
      setIsEnabled(config.isEnabled || false);
    }
  }, []);

  const handleSave = () => {
    const config = {
      city,
      apiKey,
      isEnabled
    };
    
    localStorage.setItem('weatherConfig', JSON.stringify(config));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do widget de previsão do tempo foram atualizadas."
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Configurar Widget de Previsão do Tempo</h1>
      
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cidade (formato: cidade,código_do_país)
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex: Taquaritinga,BR"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Use o formato cidade,código_do_país (Ex: Taquaritinga,BR)
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">
              API Key do OpenWeatherMap
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Sua API Key do OpenWeatherMap"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="enabled" className="text-sm font-medium">
              Exibir widget no site
            </label>
          </div>
          
          <div className="pt-4">
            <Button onClick={handleSave}>Salvar Configurações</Button>
          </div>
        </div>
      </Card>
      
      {isEnabled && city && apiKey && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Preview</h2>
          <WeatherWidget city={city} apiKey={apiKey} />
        </div>
      )}
    </div>
  );
}
