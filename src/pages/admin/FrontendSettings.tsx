
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseConfig } from "@/hooks/useSupabaseConfig";

interface SiteSettings {
  logo: {
    url: string;
    height: number;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
  };
  colors: {
    primary: string;
    secondary: string;
  };
}

export default function FrontendSettings() {
  const { toast } = useToast();
  const { getConfig, setConfig, loading } = useSupabaseConfig();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: {
      url: '',
      height: 60
    },
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      instagram: 'https://instagram.com'
    },
    colors: {
      primary: '#1a73e8',
      secondary: '#f8f9fa'
    }
  });

  // Load settings from Supabase
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const config = await getConfig('frontend_settings');
        console.log("Carregando configurações:", config);
        if (config && typeof config === 'object') {
          const configData = config as Record<string, any>;
          setSettings({
            logo: {
              url: configData.logo?.url || '',
              height: Number(configData.logo?.height) || 60
            },
            socialLinks: {
              facebook: configData.socialLinks?.facebook || 'https://facebook.com',
              twitter: configData.socialLinks?.twitter || 'https://twitter.com',
              instagram: configData.socialLinks?.instagram || 'https://instagram.com'
            },
            colors: {
              primary: configData.colors?.primary || '#1a73e8',
              secondary: configData.colors?.secondary || '#f8f9fa'
            }
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadSettings();
  }, [getConfig]);

  const updateSettings = (section: keyof SiteSettings, field: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando configurações:", settings);
    
    try {
      const success = await setConfig('frontend_settings', settings);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações foram salvas com sucesso!",
        });
        
        // Aplicar cores imediatamente
        document.documentElement.style.setProperty('--primary', settings.colors.primary);
        document.documentElement.style.setProperty('--secondary', settings.colors.secondary);
        
        // Recarregar página após 1 segundo para aplicar mudanças
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Falha ao salvar");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <p className="text-muted-foreground">
          Personalize a aparência e configurações visuais do seu site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Logo do Site</CardTitle>
            <CardDescription>
              Configure o logo que será exibido no cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="logo-url">URL do Logo</Label>
              <Input
                id="logo-url"
                type="url"
                value={settings.logo.url}
                onChange={(e) => updateSettings('logo', 'url', e.target.value)}
                placeholder="https://exemplo.com/logo.png"
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Cole aqui a URL da imagem do seu logo
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo-height">Altura do Logo (pixels)</Label>
              <Input
                id="logo-height"
                type="number"
                min="20"
                max="200"
                value={settings.logo.height}
                onChange={(e) => updateSettings('logo', 'height', Number(e.target.value))}
                placeholder="60"
                className="w-full"
              />
            </div>

            {settings.logo.url && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <Label className="text-sm font-medium">Preview do Logo:</Label>
                <div className="mt-2">
                  <img 
                    src={settings.logo.url} 
                    alt="Preview do logo" 
                    style={{ height: `${settings.logo.height}px` }}
                    className="w-auto max-w-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Cores do Tema</CardTitle>
            <CardDescription>
              Personalize as cores principais do seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary-color">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={settings.colors.primary}
                    onChange={(e) => {
                      updateSettings('colors', 'primary', e.target.value);
                      document.documentElement.style.setProperty('--primary', e.target.value);
                    }}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.colors.primary}
                    onChange={(e) => updateSettings('colors', 'primary', e.target.value)}
                    placeholder="#1a73e8"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary-color"
                    type="color"
                    value={settings.colors.secondary}
                    onChange={(e) => {
                      updateSettings('colors', 'secondary', e.target.value);
                      document.documentElement.style.setProperty('--secondary', e.target.value);
                    }}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={settings.colors.secondary}
                    onChange={(e) => updateSettings('colors', 'secondary', e.target.value)}
                    placeholder="#f8f9fa"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Configure os links das redes sociais do cabeçalho
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                type="url"
                value={settings.socialLinks.facebook}
                onChange={(e) => updateSettings('socialLinks', 'facebook', e.target.value)}
                placeholder="https://facebook.com/seusite"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X</Label>
              <Input
                id="twitter"
                type="url"
                value={settings.socialLinks.twitter}
                onChange={(e) => updateSettings('socialLinks', 'twitter', e.target.value)}
                placeholder="https://twitter.com/seusite"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                type="url"
                value={settings.socialLinks.instagram}
                onChange={(e) => updateSettings('socialLinks', 'instagram', e.target.value)}
                placeholder="https://instagram.com/seusite"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 text-lg"
          size="lg"
        >
          {loading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </form>
    </div>
  );
}
